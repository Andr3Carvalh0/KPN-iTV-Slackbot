const common = require('./../common.js')

module.exports = {
    id: function () {
        return "screens"
    },
    title: function () {
        return ":tv: *Popular Screens:*"
    },
    message: function (data) {
        return common.output(data.screens, {
            "name": ((e) => e.name),
            "value": ((e) => e.views)
        }, {
            "suffix": "events"
        })
    },
    isValid: function (data) {
        return data !== undefined && data.screens !== undefined
    }
}
