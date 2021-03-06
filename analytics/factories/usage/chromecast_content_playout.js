const common = require('./../common.js')

module.exports = {
    id: function () {
        return "chromecast content playback"
    },
    title: function () {
        return ":tv: *Chromecast:*"
    },
    message: function (data) {
        return common.output(data.chromecastPlayback, {
            name: ((e) => e.name),
            value: ((e) => e.amount)
        }, {
            suffix: "plays"
        })
    },
    isValid: function (data) {
        return data !== undefined && data.chromecastPlayback !== undefined
    }
}
