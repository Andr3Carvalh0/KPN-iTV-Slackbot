const common = require('./../common.js')

module.exports = {
    id: function () {
        return "content playback"
    },
    title: function () {
        return ":black_phone: *On Device:*"
    },
    message: function (data) {
        return common.output(data.playout, {
            "name": ((e) => e.name),
            "value": ((e) => e.amount)
        }, {
            "suffix": "plays"
        })
    },
    isValid: function (data) {
        return data !== undefined && data.playout !== undefined
    }
}
