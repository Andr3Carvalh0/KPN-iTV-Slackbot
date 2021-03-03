let database

const CACHE_TABLE_NAME = 'CACHE_VERSION'

module.exports = {
    initialize: function (instance) {
        database = instance

        database.defaults({
            CACHE_VERSION: 0
        }).write()
    },
    tag: function () {
        return 'halo'
    },
    cacheVersion: function () {
        return database.get(CACHE_TABLE_NAME).cloneDeep().value()
    },
    updateCacheVersion: function (version) {
        database.set(CACHE_TABLE_NAME, version).write()
    }
}
