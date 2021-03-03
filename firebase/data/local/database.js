let database

const PRECISE_FILTER_ENABLED = true

const CRITICAL_TABLE = 'CRITICAL'
const NON_FATAL_TABLE = 'NON_FATAL'
const TIMESTAMP_NAME = 'TIMESTAMP'

module.exports = {
    initialize: function (instance) {
        database = instance

        database.defaults({
            CRITICAL: [],
            NON_FATAL: [],
            TIMESTAMP: "0"
        }).write()
    },
    tag: function () {
        return 'firebase_alerts'
    },
    wasReported: function (item, isCritical) {
        const table = isCritical ? CRITICAL_TABLE : NON_FATAL_TABLE

        const filter = PRECISE_FILTER_ENABLED
            ? {problem: item.problem, version: item.version, line: item.line}
            : {problem: item.problem, version: item.version}

        const query = database.get(table)
            .find(filter)
            .value()

        return query !== undefined
    },
    push: function (items, isCritical) {
        const table = isCritical ? CRITICAL_TABLE : NON_FATAL_TABLE

        items.forEach(e => {
            database.get(table).push(e).write()
        })
    },
    getTimestamp: function () {
        return database.get(TIMESTAMP_NAME).cloneDeep().value()
    },
    setTimestamp: function (time) {
        database.set(TIMESTAMP_NAME, time).write()
    }
}
