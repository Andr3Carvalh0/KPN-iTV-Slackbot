const analytics = require('./../../analytics/analytics.js')
const attachments = require('./../../gmail/data/repository.js')
const configuration = require('./../../configuration/configurations.js')
const date = require('./../../utilities/time/date.js')
const log = require('./../../utilities/debug/logger.js')
const network = require('./../../utilities/slack/manager.js')
const timer = require('./../../utilities/time/time.js')

function notify(channel, body) {
    return network.post(channel, body)
}

const TAG = 'reports.js'

const END_SCHEDULE = 10

module.exports = {
    time: function () {
        return timer.minutes(5)
    },
    execute: function () {
        if (!configuration.DISABLE_FRIDAY_REPORTS) {
            const hour = parseInt(timer.now('H'))

            const data = 'resources/reports/report5.pdf'

            analytics.android(data, [{id: configuration.RELEASE_CHANNEL}])
                .then((views) => {
                    views.forEach(e => {
                        notify(e.id, e.view)
                            .then(() => log.i(TAG, `Android Friday reports sent for ${e.id}!`))
                            .catch((error) => log.e(TAG, `${e.id} thrown error: ${error}`))
                    })
                })
                .catch((err) => log.d(TAG, err))

            analytics.ios(data, [{id: configuration.IOS_RELEASE_CHANNEL}])
                .then((views) => {
                    views.forEach(e => {
                        notify(e.id, e.view)
                            .then(() => log.i(TAG, `iOS Friday reports sent for ${e.id}!`))
                            .catch((error) => log.e(TAG, `${e.id} thrown error: ${error}`))
                    })
                })
                .catch((err) => log.d(TAG, err))
        }
    }
}
