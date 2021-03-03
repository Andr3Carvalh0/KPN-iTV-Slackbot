const configuration = require('./../../../configuration/configurations.js')
const log = require('./../../../utilities/debug/logger.js')
const manager = require('./../../../play_store/replies/manager.js')
const playstore = require('./../../../play_store/feedback.js')
const slack = require('./../../../utilities/network/slack.js')

const TAG = 'post_reply.js'
const IDENTIFIER = 'view_submission'
const BUTTON_IDENTIFIER = 'reply_review'

const SLACK_TOKEN = configuration.SLACK_TOKEN
const SLACK_CHANNEL = configuration.REVIEWS_CHANNEL

const USERS_EMOTICONS = require('./../../../authentication/slack/users.json')

function fetchMessage(token, channelId, messageId) {
    return new Promise((res, rej) => {
        slack.conversations(
            token,
            channelId,
            messageId,
            1,
            true
        )
            .then((message) => res(message))
            .catch((error) => rej(error))
    })
}

function editMessage(token, channelId, messageId, attachments) {
    return new Promise((res, rej) => {
        slack.editConversations(
            token,
            channelId,
            messageId,
            [attachments]
        )
            .then(() => res())
            .catch((error) => rej(error))
    })
}

function leaveEmoticon(token, channelId, messageId, userId) {
    return new Promise((res) => {
        const filter = USERS_EMOTICONS.filter(e => e.name === userId)

        if (filter.length === 0 || filter.length > 0 && filter[0].emoticon === undefined) {
            res()
        } else {
            slack.leaveEmoticon(
                token,
                channelId,
                messageId,
                filter[0].emoticon
            )
                .then(() => res())
                .catch(() => res())
        }
    })
}

function reportToUser(token, channelId, userId, text) {
    return slack.ephemeral(
        token,
        channelId,
        text,
        userId
    )
}

function comment(token, channelId, messageId, commenterId, reviewId, reply) {
    return new Promise((res) => {
        manager.prepareReviewReply(commenterId, reviewId, reply)
            .then((data) => {
                slack.messageThread(token, channelId, messageId, [data.attachments[0]])
                    .then(() => res())
                    .catch(() => {
                        log.e(TAG, `Failed to message thread: ${messageId}`)
                        res()
                    })
            })
    })
}

function acknowledge(res) {
    res.send({response_action: "clear"})
}

function removeReplyButton(message, reviewId) {
    let attachments = message.messages[0].attachments[0]

    attachments.blocks = attachments.blocks.filter(e => !(
        e.elements !== undefined &&
        e.elements[0].action_id === BUTTON_IDENTIFIER &&
        e.elements[0].value === reviewId)
    )

    return attachments
}

function postSuccess(message, name, review, cmt) {
    fetchMessage(SLACK_TOKEN, SLACK_CHANNEL, message)
        .then((data) => {
            Promise.allSettled([
                editMessage(SLACK_TOKEN, SLACK_CHANNEL, message, removeReplyButton(data, review)),
                leaveEmoticon(SLACK_TOKEN, SLACK_CHANNEL, message, name),
                comment(SLACK_TOKEN, SLACK_CHANNEL, message, name, review, cmt)
            ])
                .then(() => log.d(TAG, `Slack message updated!`))
                .catch((error) => log.e(TAG, `An error occurred while trying to modify slacks message: ${error}.`))
        })
        .catch((error) => log.e(TAG, `Cannot fetch slack message: ${error}.`))
}

function success(res, message, user, review, cmt) {
    if (message === undefined) {
        log.e(TAG, `Dont have a valid messageId.`)
        reportToUser(SLACK_TOKEN, SLACK_CHANNEL, user, message)
            .then(() => acknowledge(res))
            .catch(() => acknowledge(res))
    } else {
        acknowledge(res)
        postSuccess(message, user.name, review, cmt)
    }
}

function error(res, message) {
    res.send({
        response_action: "errors",
        errors: {
            response_text_view: message
        }
    })
}

module.exports = {
    process: function (req) {
        try {
            if (req.body === undefined) return false

            const payload = JSON.parse(req.body.payload)

            return payload !== undefined && payload.type === IDENTIFIER
        } catch (e) {
            return false
        }
    },
    handle: function (req, res, next) {
        const payload = JSON.parse(req.body.payload)

        const decoded = manager.decode(payload.view.callback_id)
        const reviewId = decoded.reviewId
        const messageId = decoded.messageId

        const text = payload.view.state.values.response_text_view.response_text.value

        const userId = payload.user.id
        const username = payload.user.username

        if (manager.hasPermissions(username)) {
            playstore.reply(reviewId, text)
                .then(() => {
                    log.w(TAG, `${username} has replied to review with id: ${reviewId}.`)
                    success(res, messageId, {id: userId, name: username}, reviewId, text)
                })
                .catch((error) => {
                    log.e(TAG, error)
                    error(req, 'Failed to post response to the Play Store.')
                })
        } else {
            log.e(TAG, "User without permission tried to post review.")
            error(res, "You dont have permission to do this!")
        }
    }
}
