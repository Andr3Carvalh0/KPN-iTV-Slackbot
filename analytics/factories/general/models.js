const common = require('./../common.js')

module.exports = {
    id: function () {
        return "models"
    },
    title: function () {
        return ":black_phone: *Popular Devices:*"
    },
    message: function (data) {
        return common.output(data.devicesBrands, {
            name: ((e) => e.name),
            value: ((e) => e.amount)
        }, {
            suffix: "devices"
        })
    },
    isValid: function (data) {
        return data !== undefined && data.devicesBrands !== undefined
    }
}
