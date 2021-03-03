const configuration = require('./../../../configuration/configurations.js')
const log = require('./../../../utilities/debug/logger.js')
const manager = require('./../../../play_store/replies/manager.js')
const slack = require('./../../../utilities/network/slack.js')

const TAG = 'open_reply_modal.js'
const IDENTIFIER = 'reply_review'

module.exports = {
    process: function (req) {
        try {
            if (req.body === undefined) return false

            const payload = JSON.parse(req.body.payload)

            return payload !== undefined &&
                payload.actions !== undefined &&
                payload.actions.length > 0 &&
                payload.actions[0].action_id === IDENTIFIER &&
                payload.trigger_id !== undefined
        } catch (e) {
            return false
        }
    },
    handle: function (req, res, next) {
        const payload = JSON.parse(req.body.payload)

        const reviewId = payload.actions[0].value
        const messageId = payload.container.message_ts
        const user = payload.user.username

        log.w(TAG, `${user} has tried to reply to a review with id ${reviewId}`)

        manager.openModal(reviewId, messageId, user)
            .then((view) => {
                slack.openModal(configuration.SLACK_TOKEN, payload.trigger_id, view)
                    .then(() => log.d(TAG, "Reply modal invoked!"))
                    .catch((err) => log.e(TAG, err))
            })

        res.sendStatus(200)
    }
}
