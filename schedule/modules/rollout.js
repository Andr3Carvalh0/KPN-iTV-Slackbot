const configuration = require('./../../configuration/configurations.js')
const log = require('./../../utilities/debug/logger.js')
const manager = require('./../../play_store/releases/manager.js')
const network = require('./../../utilities/slack/manager.js')
const timer = require('./../../utilities/time/time.js')

function notify(channel, body) {
    return network.post(channel, body)
}

const TAG = 'rollout.js'

module.exports = {
    time: function () {
        return timer.minutes(15)
    },
    execute: function () {
        manager.rollout()
            .then((view) => {
                notify(configuration.RELEASE_CHANNEL, view)
                    .then(() => log.i(TAG, 'Sent a rollout update'))
                    .catch(() => log.e(TAG, 'Fail to send a update about the rollout'))
            })
            .catch((err) => log.d(TAG, err))
    }
}
