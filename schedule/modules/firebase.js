const configuration = require('./../../configuration/configurations.js')
const firebase = require('./../../firebase/firebase.js')
const log = require('./../../utilities/debug/logger.js')
const network = require('./../../utilities/slack/manager.js')
const timer = require('./../../utilities/time/time.js')

function notify(channel, body) {
    return network.post(channel, body)
}

const TAG = 'firebase.js'

module.exports = {
    time: function () {
        return timer.minutes(5)
    },
    execute: function () {
        firebase.fetch()
            .then(data => {
                if (data.critical !== undefined) {
                    Promise.allSettled(data.critical.map(e => notify(configuration.RELEASE_CHANNEL, e)))
                        .then(() => log.i(TAG, 'Sent critical event(s)'))
                        .catch(() => log.e(TAG, 'Fail to send critical event(s)'))
                }

                if (data.nonFatal !== undefined) {
                    Promise.allSettled(data.nonFatal.map(e => notify(configuration.FIREBASE_CHANNEL, e)))
                        .then(() => log.i(TAG, 'Sent non critical event(s)'))
                        .catch(() => log.e(TAG, 'Fail to send non critical event(s)'))
                }
            })
            .catch((err) => log.d(TAG, err))
    }
}
