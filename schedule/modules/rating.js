const configuration = require('./../../configuration/configurations.js')
const database = require('./data/database.js')
const log = require('./../../utilities/debug/logger.js')
const network = require('./../../utilities/slack/manager.js')
const render = require('./../../play_store/render/render.js')
const timer = require('./others/interval.js')

function notify(channel, body) {
    return network.post(channel, body)
}

const TAG = 'rating.js'

module.exports = {
    time: function () {
        return timer.interval(6, 8, 0, 60)
    },
    execute: function () {
        const messages = database.messages()

        if (messages.length > 0) {
            const message = messages[messages.length - 1]
            const previous = database.lastSentRating()

            if (previous.current === message.current) {
                log.i(TAG, 'Queues last value matches the last rating report!')
                database.clearMessages()
            } else {
                render.rating(message).then((view) => {
                    notify(configuration.RELEASE_CHANNEL, view)
                        .then(() => {
                            database.updateLastSentRating(message)
                            database.clearMessages()
                            log.i(TAG, 'New Android rating sent!')
                        })
                        .catch((err) => log.e(TAG, err))
                }).catch((err) => log.d(TAG, err))
            }
        }
    }
}
