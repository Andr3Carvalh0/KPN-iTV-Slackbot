let database

const WHITELIST_TABLE_NAME = 'VALUES'

module.exports = {
    initialize: function (instance) {
        database = instance

        database.defaults({
            VALUES: []
        }).write()
    },
    tag: function () {
        return 'locations'
    },
    whitelisted: function () {
        return database.get(WHITELIST_TABLE_NAME).cloneDeep().value()
    },
    whitelist: function (ip) {
        database.get(WHITELIST_TABLE_NAME)
            .value()
            .push(ip)

        database.get(WHITELIST_TABLE_NAME).write()
    }
}
