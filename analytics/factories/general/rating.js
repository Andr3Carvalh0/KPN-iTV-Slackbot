const common = require('./../common.js')

function processCrashes(data) {
    if (data !== undefined) {
        const crashDrop = delta((data.percentage - data.lastWeekPercentage).toFixed(3))

        return `${data.percentage}%${crashDrop !== "+0.000" && crashDrop !== undefined ? ` (${crashDrop})` : ""}`
    }

    return `Unknown`
}

function delta(value) {
    if (value === 0.000) {
        return undefined
    } else if (value < 0.000) {
        return `${value}`
    } else {
        return `+${value}`
    }
}

module.exports = {
    id: function () {
        return "rating/crashes"
    },
    title: function () {
        return `:kpn: *iTV Vitals:*`
    },
    message: function (data) {
        const ratingDrop = delta(parseFloat((parseFloat(data.rating.detail, 10) - parseFloat(data.rating.lastWeek, 10)).toFixed(3)))
        const items = [
            {
                name: "Latest release",
                value: `${data.histogram !== undefined ? data.histogram.version : "Unknown"}`
            },
            {
                name: "Rating",
                value: `${data.rating.detail}${ratingDrop !== undefined ? ` (${ratingDrop})` : ""}`
            },
            {
                name: "Crash-Free",
                value: `${processCrashes(data.crashes)}`
            }
        ]

        return common.output(items, {
            'name': ((e) => e.name),
            'value': ((e) => e.value)
        })
    },
    isValid: function (data) {
        return data !== undefined && data.rating !== undefined && data.version !== undefined
    }
}
