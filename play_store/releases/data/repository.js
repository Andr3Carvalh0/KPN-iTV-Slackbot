const database = require('./database.js')

module.exports = {
    update: function (name, code, percentage) {
        database.update(name, code, percentage)
    },
    fetch: function () {
        return database.fetch()
    },
    remove: function () {
        database.remove()
    }
}
