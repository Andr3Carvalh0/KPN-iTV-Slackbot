const common = require('./../common.js')

module.exports = {
    id: function () {
        return "sports & kids"
    },
    title: function () {
        return ":soccer: :baby: *Sports & Kids Env:*"
    },
    message: function (data) {
        return common.output(data.sportsAndKids, {
            "name": ((e) => e.name),
            "value": ((e) => e.views)
        }, {
            "suffix": "users"
        })
    },
    isValid: function (data) {
        return data !== undefined && data.sportsAndKids !== undefined
    }
}
