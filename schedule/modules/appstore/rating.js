const configuration = require('./../../../configuration/configurations.js')
const log = require('./../../../utilities/debug/logger.js')
const network = require('./../../../utilities/slack/manager.js')
const store = require('./../../../app_store/feedback.js')
const time = require('./../../../utilities/time/time.js')

function notify(channel, body) {
    return network.post(channel, body)
}

const TAG = 'appstore_rating.js'

module.exports = {
    time: function () {
        return time.hours(3)
    },
    execute: function () {
        store.rating()
            .then((view) => {
                notify(configuration.IOS_RELEASE_CHANNEL, view)
                    .then(() => log.i(TAG, 'New iOS rating sent!'))
                    .catch((err) => log.e(TAG, err))
            })
            .catch((error) => log.d(TAG, error))
    }
}
