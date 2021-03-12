const database = require('./../data/database.js')
const log = require('./../../../utilities/debug/logger.js')
const rating = require('./schedule/rating.js')
const store = require('./../../../play_store/feedback.js')
const time = require('./../../../utilities/time/time.js')

const TAG = 'playstore_rating.js'

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
        return time.hours(3)
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
    }
}
