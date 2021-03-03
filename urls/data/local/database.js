let database

const TABLE_NAME = 'URLS'

module.exports = {
    initialize: function (instance) {
        database = instance

        database.defaults({
            URLS: []
        }).write()
    },
    tag: function () {
        return 'builds'
    },
    findItem: function (url) {
        return database.get(TABLE_NAME)
            .find({short: url})
            .cloneDeep()
            .value()
    },
    updateItem: function (url) {
        database.get(TABLE_NAME)
            .find({short: url})
            .update('count', n => n + 1)
            .write()
    },
    writeItem: function (original, fallback, short) {
        database.get(TABLE_NAME)
            .push({
                "original": original,
                "fallback": fallback,
                "short": short,
                "count": 0
            })
            .write()
    },
    removeItem: function (file) {
        database.get(TABLE_NAME)
            .remove(({
                         original,
                         fallback,
                         short,
                         count
                     }) => original.includes(file) || short.includes(file) || fallback.includes(file))
            .write()
    }
}
