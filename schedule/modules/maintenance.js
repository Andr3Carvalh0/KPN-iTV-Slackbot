const configuration = require('./../../configuration/configurations.js')
const maintenance = require('./../../maintenance/maintenance.js')
const path = require('path')
const timer = require('./../../utilities/time/time.js')

module.exports = {
    time: function () {
        return timer.days(1)
    },
    execute: function () {
        maintenance.filesystem(`${path.join(__dirname, `..`, `..`, configuration.APK_DIRECTORY)}`)
        maintenance.databases()
    }
}
