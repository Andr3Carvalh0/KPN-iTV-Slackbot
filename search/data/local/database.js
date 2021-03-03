let database

const BUILDS_TABLE_NAME = 'BUILDS'

module.exports = {
    initialize: function (instance) {
        database = instance

        database.defaults({
            BUILDS: []
        }).write()
    },
    tag: function () {
        return 'search'
    },
    add: function (information) {
        database.get(BUILDS_TABLE_NAME)
            .push(information)
            .write()
    },
    get: function () {
        return database.get(BUILDS_TABLE_NAME).cloneDeep().value()
    }
}
