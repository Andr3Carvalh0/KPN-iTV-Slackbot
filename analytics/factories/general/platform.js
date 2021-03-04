const common = require('./../common.js')

const ANDROID = 0

module.exports = {
    id: function () {
        return "platform"
    },
    title: function (data, os) {
        const emoji = os === ANDROID ? ":android1:" : ":black_phone:"
        const platform = os === ANDROID ? "Android" : "iOS"

        return `${emoji} *Popular ${platform} Versions:*`
    },
    message: function (data) {
        return common.output(data.platform, {
            name: ((e) => e.name),
            value: ((e) => e.percentage)
        }, {
            suffix: "users"
        })
    },
    isValid: function (data) {
        return data !== undefined && data.platform !== undefined
    }
}
