const common = require('./../common.js')

module.exports = {
    id: function () {
        return "playback"
    },
    title: function () {
        return ":popcorn: *Playback:*"
    },
    message: function (data) {
        return common.output(data.player, {
            "name": ((e) => e.name),
            "value": ((e) => e.start)
        }, {
            "suffix": "plays"
        })
    },
    isValid: function (data) {
        return data !== undefined && data.player !== undefined && data.player.length > 0
    }
}
