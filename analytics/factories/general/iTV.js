const common = require('./../common.js')

module.exports = {
    id: function () {
        return "iTV"
    },
    title: function () {
        return ":kpn: *Popular iTV Versions:*"
    },
    message: function (data) {
        return common.output(data.version, {
            "name": ((e) => e.name),
            "value": ((e) => e.number)
        }, {
            "suffix": "users"
        })
    },
    isValid: function (data) {
        return data !== undefined && data.version !== undefined
    }
}
