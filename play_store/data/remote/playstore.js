const configuration = require('./../../../configuration/configurations.js')
const google = require('./../../../google/google.js')
const locale = require('./../../../utilities/others/locale.js')
const play = require('google-play-scraper')

const SCOPES = ['https://www.googleapis.com/auth/androidpublisher']

const USE_REST_API = configuration.USE_PLAY_STORE_OAUTH_TO_FETCH_REVIEWS

function console() {
    return google.playConsole()
}

function authenticate() {
    return google.authenticateJWT(
        configuration.PLAY_STORE_CREDENTIALS,
        SCOPES
    )
}

function reviews(client, packageId, amount, locale) {
    return new Promise((res, rej) => {
        console().reviews.list({
            auth: client,
            packageName: packageId,
            maxResults: amount,
            translationLanguage: locale
        }, (err, data) => {
            if (!err) {
                res(data.data.reviews)
            } else {
                rej(err)
            }
        })
    })
}

function editId(client, id) {
    return new Promise((res, rej) => {
        console().edits.insert({
            auth: client,
            packageName: id
        }, (err, data) => {
            if (!err) {
                res(data.data.id)
            } else {
                rej(err)
            }
        })
    })
}

function rollout(client, packageId, edit, trackName) {
    return new Promise((res, rej) => {
        console().edits.tracks.get({
            auth: client,
            packageName: packageId,
            editId: edit,
            track: trackName
        }, (err, data) => {
            if (!err) {
                res(data.data.releases)
            } else {
                rej(err)
            }
        })
    })
}

function deleteEdit(client, id, edit) {
    return new Promise((res, rej) => {
        console().edits.delete({
            auth: client,
            packageName: id,
            editId: edit
        }, (err, data) => {
            if (!err) {
                res()
            } else {
                rej(err)
            }
        })
    })
}

function reply(client, review, packageId, reply) {
    return new Promise((res, rej) => {
        console().reviews.reply({
            auth: client,
            packageName: packageId,
            reviewId: review,
            requestBody: {
                replyText: reply
            }
        }, (err, data) => {
            if (!err) {
                res()
            } else {
                rej(err)
            }
        })
    })
}

module.exports = {
    rating: function (id) {
        return new Promise((res, rej) => {
            play.app({appId: id})
                .then(data => res(data))
                .catch(err => rej(err))
        })
    },
    reviews: function (id, amount) {
        return new Promise((res, rej) => {
            if (USE_REST_API) {
                authenticate()
                    .then(client => {
                        reviews(client, id, amount, locale.ENGLISH)
                            .then((response) => {
                                const reviews = response.map(e => {
                                    const comment = e.comments[0].userComment
                                    let developerComment = undefined
                                    let replyInterval = 0

                                    if (e.comments.length > 1) {
                                        developerComment = e.comments[1].developerComment
                                        replyInterval = parseInt(comment.lastModified.seconds) - parseInt(e.comments[1].developerComment.lastModified.seconds)
                                    }

                                    const review = comment.originalText === undefined ? comment.text.split('\t') : comment.originalText.split('\t')
                                    const reviewTranslated = comment.originalText === undefined ? "" : comment.text.split('\t')

                                    const model = comment.deviceMetadata === undefined ? undefined : comment.deviceMetadata.productName

                                    return {
                                        id: e.reviewId,
                                        isReply: developerComment !== undefined,
                                        userName: e.authorName,
                                        interval: replyInterval,
                                        text: review[review.length - 1],
                                        translatedText: reviewTranslated === "" ? "" : reviewTranslated[reviewTranslated.length - 1],
                                        date: comment.lastModified.seconds * 1000,
                                        scoreText: comment.starRating,
                                        version: comment.appVersionName,
                                        thumbsUp: comment.thumbsUpCount,
                                        device: model === undefined ? "Unknown" : model.substring(model.indexOf("(") + 1, model.length - 1),
                                        manufacturer: comment.deviceMetadata === undefined ? undefined : comment.deviceMetadata.manufacturer,
                                        os: comment.androidOsVersion // This is API level(eg: 23)
                                    }
                                })

                                res({data: reviews})
                            })
                            .catch((err) => rej(err))
                    })
                    .catch(error => rej(error))
            } else {
                play.reviews({
                    appId: id,
                    sort: play.sort.NEWEST,
                    num: amount
                })
                    .then(data => res(data))
                    .catch(err => rej(err))
            }
        })
    },
    rollout: function (id) {
        return new Promise((res, rej) => {
            authenticate().then(client => {
                editId(client, id)
                    .then((edit) => {
                        rollout(client, id, edit, "production")
                            .then((state) => {
                                deleteEdit(client, id, edit)
                                    .then(() => {
                                        if (state.length > 0) {
                                            res(state[0])
                                        } else {
                                            rej("There isnt any info about the selected track.")
                                        }
                                    })
                                    .catch((err) => rej(err))
                            })
                            .catch((err) => {
                                deleteEdit(client, id, edit)
                                    .then(() => rej(err))
                                    .catch(() => rej(err))
                            })

                    })
                    .catch((err) => rej(err))
            })
        })
    },
    reply: function (review, text, id) {
        return new Promise((res, rej) => {
            authenticate().then(client => {
                reply(client, review, id, text)
                    .then(() => res())
                    .catch((err) => rej(err))
            })
        })
    }
}
