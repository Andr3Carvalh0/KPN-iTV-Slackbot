const common = require('./../common.js')

module.exports = {
    id: function () {
        return "per release"
    },
    title: function () {
        return `:chart_with_upwards_trend: *Per Release Insights:*`
    },
    message: function (data) {
        return common.output(data.ratingsPerVersion, {
            name: ((e) => e.version),
            value: ((e) => `*average:* ${e.average.toFixed(2)}\t*mode:* ${e.mode}`)
        })
    },
    isValid: function (data) {
        return data !== undefined && data.ratingsPerVersion !== undefined && data.ratingsPerVersion.length > 0
    }
}
