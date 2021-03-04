const common = require('./../common.js')

module.exports = {
    id: function () {
        return "session"
    },
    title: function () {
        return ":clock10: *Top Sessions Duration:*"
    },
    message: function (data) {
        return common.output(data.sessions.slice(0, 3), {
            name: ((e) => e.name),
            value: ((e) => e.percentage)
        })
    },
    isValid: function (data) {
        return data !== undefined && data.sessions !== undefined
    }
}
