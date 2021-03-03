const randomizer = require('./../../../utilities/others/randomizer.js')
const timer = require('./../../../utilities/time/time.js')

module.exports = {
    interval: function (minHour, maxHour, minMin, maxMin) {
        const h = randomizer.generate(minHour, maxHour, {isInclusive: true})
        const m = randomizer.generate(minMin, maxMin, {isInclusive: true})

        if (h === 0 && m === 0) {
            return timer.hours(1)
        } else {
            return timer.hours(h) + timer.minutes(m)
        }
    }
}