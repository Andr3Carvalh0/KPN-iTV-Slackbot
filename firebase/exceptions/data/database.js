let database

const EXCEPTIONS_TABLE = 'EXCEPTIONS'

module.exports = {
    initialize: function (instance) {
        database = instance

        database.defaults({
            EXCEPTIONS: []
        }).write()
    },
    tag: function () {
        return 'firebase_exceptions_dictionary'
    },
    issue: function (exception) {
        const item = database.get(EXCEPTIONS_TABLE)
            .find(({file}) => file.includes(exception.file))
            .cloneDeep()
            .value()

        return (item !== undefined) ? item.cause : undefined
    },
    add: function (key, reason) {
        const entry = database.get(EXCEPTIONS_TABLE)
            .find(({cause}) => cause === reason)
            .value()

        if (entry === undefined) {
            database.get(EXCEPTIONS_TABLE)
                .push({
                    file: [key],
                    cause: reason
                })
                .write()
        } else {
            if (!entry.file.includes(key)) {
                entry.file.push(key)
                database.get(EXCEPTIONS_TABLE).write()
            }
        }
    }
}
