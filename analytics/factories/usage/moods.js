const common = require('./../common.js')

module.exports = {
    id: function () {
        return "moods"
    },
    title: function () {
        return ":kpn::snowflake: *Popular Moods:*"
    },
    message: function (data) {
        return common.output(data.moods, {
            name: ((e) => e.name),
            value: ((e) => e.number)
        }, {
            suffix: "clicks"
        })
    },
    isValid: function (data) {
        return data !== undefined && data.moods !== undefined
    }
}
