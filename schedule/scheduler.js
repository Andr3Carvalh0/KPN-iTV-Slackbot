const configuration = require('./../configuration/configurations.js')
const log = require('./../utilities/debug/logger.js')

const modules = configuration.SIMPLE_MODE
    ? new Map([
        ['FRITS', require('./modules/frits.js')],
        ['MAINTENANCE', require('./modules/maintenance.js')]
    ])
    : new Map([
        ['APP_STORE', require('./modules/appstore.js')],
        ['FIREBASE', require('./modules/firebase.js')],
        ['FRITS', require('./modules/frits.js')],
        ['HALO', require('./modules/halo.js')],
        ['MAINTENANCE', require('./modules/maintenance.js')],
        ['PLAY_STORE_ANALYTICS', require('./modules/playstore.js')],
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
