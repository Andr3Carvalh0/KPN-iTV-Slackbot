const configuration = require('./../configuration/configurations.js')
const log = require('./../utilities/debug/logger.js')

const modules = new Map([
    ['APP_STORE_RATING', require('./modules/appstore/rating.js')],
    ['APP_STORE_REVIEWS', require('./modules/appstore/reviews.js')],
    ['FIREBASE', require('./modules/firebase.js')],
    ['BIRTHDAYS', require('./modules/birthdays.js')],
    ['HALO', require('./modules/halo.js')],
    ['MAINTENANCE', require('./modules/maintenance.js')],
    ['PLAY_STORE_RATING', require('./modules/playstore/rating.js')],
    ['PLAY_STORE_REVIEWS', require('./modules/playstore/reviews.js')],
    ['REPORTS', require('./modules/reports.js')],
    ['ROLLOUT', require('./modules/rollout.js')]
])

const timers = new Map()
const TAG = "scheduler.js"

function instantiate(id) {
    const module = modules.get(id)
    const time = module.time()

    log.d(TAG, `Module ${id} set interval for ${time}ms`)

    timers.set(id,
        // We use setTimeout instead of setInterval to support dynamic times
        setTimeout(() => {
            module.execute()
            instantiate(id)
        }, time)
    )
}

module.exports = {
    schedule: function () {
        for (const key of modules.keys()) {
            instantiate(key)

            if (configuration.DRY_RUN) {
                modules.get(key).execute()
            }
        }
    }
}
