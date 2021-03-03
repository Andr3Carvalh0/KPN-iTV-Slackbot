const configuration = require('./../../configuration/configurations.js')
const database = require('./data/database.js')
const log = require('./../../utilities/debug/logger.js')
const network = require('./../../utilities/slack/manager.js')
const rating = require('./rating.js')
const store = require('./../../play_store/feedback.js')
const time = require('./../../utilities/time/time.js')

function notify(channel, body) {
    return network.post(channel, body)
}

const TAG = 'playstore.js'

function prepareTrigger() {
    if (trigger !== undefined) {
        clearTimeout(trigger)
    }
    trigger = setTimeout(() => {
        rating.execute()
    }, rating.time())
}

let trigger = undefined

module.exports = {
    time: function () {
        return time.minutes(5)
    },
    execute: function () {
        if (database.messages().length > 0 && trigger === undefined) {
            prepareTrigger()
        }

        store.rating()
            .then(message => {
                database.pushMessage(message)
                prepareTrigger()
            })
            .catch((err) => log.d(TAG, err))

        store.reviews()
            .then(messages => {
                Promise.allSettled(messages.map(view => notify(configuration.REVIEWS_CHANNEL, view)))
                    .then(() => log.i(TAG, 'New Android review(s) sent!'))
                    .catch((err) => log.e(TAG, err))
            })
            .catch((err) => log.d(TAG, err))
    }
}
