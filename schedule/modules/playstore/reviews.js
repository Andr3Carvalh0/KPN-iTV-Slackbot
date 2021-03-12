const configuration = require('./../../../configuration/configurations.js')
const log = require('./../../../utilities/debug/logger.js')
const network = require('./../../../utilities/slack/manager.js')
const store = require('./../../../play_store/feedback.js')
const time = require('./../../../utilities/time/time.js')

function notify(channel, body) {
    return network.post(channel, body)
}

const TAG = 'playstore_reviews.js'

module.exports = {
    time: function () {
        return time.minutes(5)
    },
    execute: function () {
        store.reviews()
            .then(messages => {
                Promise.allSettled(messages.map(view => notify(configuration.REVIEWS_CHANNEL, view)))
                    .then(() => log.i(TAG, 'New Android review(s) sent!'))
                    .catch((err) => log.e(TAG, err))
            })
            .catch((err) => log.d(TAG, err))
    }
}
