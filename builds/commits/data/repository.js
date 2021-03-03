const database = require('./database.js')
const time = require('./../../../utilities/time/time.js')

module.exports = {
    update: function (branch, platform, hash) {
        database.update(branch, platform, hash, time.unix())
    },
    fetch: function (branch, platform) {
        return database.fetch(branch, platform)
    },
    remove: function (branch, platform) {
        database.remove(branch, platform)
    },
    all: function (platform) {
        return database.all(platform)
    }
}
