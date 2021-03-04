const common = require('./../common.js')

module.exports = {
    id: function () {
        return "users"
    },
    title: function () {
        return ":older_woman: *User Demographic:*"
    },
    message: function (data) {
        return common.output(data.users, {
            name: ((e) => e.name),
            value: ((e) => e.amount)
        })
    },
    isValid: function (data) {
        return data !== undefined && data.users !== undefined
    }
}
