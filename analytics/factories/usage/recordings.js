const common = require('./../common.js')

module.exports = {
    id: function () {
        return "recordings"
    },
    title: function () {
        return ":movie_camera: *Top Recording Actions:*"
    },
    message: function (data) {
        return common.output(data.recordings.slice(0, 3), {
            "name": ((e) => e.name),
            "value": ((e) => e.amount)
        }, {
            "suffix": "events"
        })
    },
    isValid: function (data) {
        return data !== undefined && data.recordings !== undefined
    }
}
