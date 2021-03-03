const encoding = require('./../../utilities/encryption/base64.js')
const machineLearning = require('./../../machine_learning/learning/manager.js')
const manager = require('./../data/repository.js')
const text = require('./../../utilities/strings/text.js')
const translation = require('./../../translate/manager.js')
const render = require('./render/render.js')

const WHITELISTED_USERS = require('./../../authentication/slack/users.json').map(e => e.name)
const SKIP_VALIDATION = true

function translateReply(reply) {
    return new Promise((res) => {
        translation.translate(reply)
            .then((texts) => {
                res({
                    original: reply,
                    translated: texts[0].translated ? texts[0].text : undefined
                })
            })
            .then(() => {
                res({
                    original: reply,
                    translated: undefined
                })
            })
    })
}

module.exports = {
    hasPermissions: function (user) {
        return SKIP_VALIDATION || WHITELISTED_USERS.includes(user)
    },
    openModal: function (reviewId, messageId, user) {
        return new Promise((res) => {
            if (this.hasPermissions(user)) {
                manager.findReview(reviewId)
                    .then((data) => {
                        res(
                            render.input(
                                encoding.encode(`${reviewId}.${messageId}`),
                                text.capitalizeOnSpace(data.name),
                                data
                            )
                        )
                    })
                    .catch(() => res(render.invalid()))
            } else {
                res(render.permissions())
            }
        })
    },
    decode: function (text) {
        const decoded = encoding.decode(text)
        const split = decoded.split(".")

        let result = {
            reviewId: undefined,
            messageId: undefined
        }

        if (split.length < 3) {
            result.reviewId = text
        } else {
            for (let i = split.length - 2; i < split.length; i++) {
                result.messageId = `${result.messageId === undefined ? "" : result.messageId}${result.messageId === undefined ? "" : "."}${split[i]}`
            }

            for (let i = 0; i < split.length - 2; i++) {
                result.reviewId = `${result.reviewId === undefined ? "" : result.reviewId}${result.reviewId === undefined ? "" : "."}${split[i]}`
            }
        }

        return result
    },
    prepareReviewReply: function (commenterId, reviewId, reply) {
        return new Promise((res) => {
            manager.findReview(reviewId)
                .then((data) => {
                    translateReply(reply)
                        .then((translation) => {
                            machineLearning.reply(
                                data.review.original,
                                data.review.translated,
                                translation.original,
                                translation.translated,
                                data.rating
                            )

                            res(render.reply(data.name, translation, commenterId))
                        })
                })
                .catch(() => {
                    translateReply(reply)
                        .then((translation) => res(render.reply(undefined, translation, commenterId)))
                })
        })
    }
}
