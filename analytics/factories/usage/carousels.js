const common = require('./../common.js')

module.exports = {
    id: function () {
        return "carousels"
    },
    title: function () {
        return ":movie_camera: *Popular Carousels:*"
    },
    message: function (data) {
        return common.output(data.carousels, {
            "name": ((e) => e.name),
            "value": ((e) => e.number)
        }, {
            "suffix": "clicks"
        })
    },
    isValid: function (data) {
        return data !== undefined && data.carousels !== undefined
    }
}
