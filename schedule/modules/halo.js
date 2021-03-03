const configuration = require('./../../configuration/configurations.js')
const halo = require('./../../halo/halo.js')
const log = require('./../../utilities/debug/logger.js')
const network = require('./../../utilities/slack/manager.js')
const timer = require('./../../utilities/time/time.js')

function notify(channel, body) {
    return network.post(channel, body)
}

const TAG = 'halo.js'

module.exports = {
    time: function () {
        return timer.minutes(30)
    },
    execute: function () {
        halo.isCacheInvalidated()
            .then((view) => {
                notify(configuration.RELEASE_CHANNEL, view)
                    .then(() => log.i(TAG, 'Sent a update cache event'))
                    .catch(() => log.e(TAG, 'Fail to send a update cache event'))
            })
            .catch((err) => log.d(TAG, err))
    }
}
