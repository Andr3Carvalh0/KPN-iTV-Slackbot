const timezone = require('moment-timezone')

const LOCAL = 'Europe/Amsterdam'

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const DEFAULT_FORMAT = 'DD/MM HH:mm'

module.exports = {
    BEGIN_DAY: 8,
    MID_DAY: 12,
    END_DAY: 18,
    now: function (format) {
        return timezone.tz(LOCAL).format(format || DEFAULT_FORMAT)
    },
    day: function () {
        return timezone.tz(LOCAL).day()
    },
    year: function () {
        return timezone.tz(LOCAL).year()
    },
    from: function (string) {
        return timezone.tz(string, LOCAL)
    },
    weekNumber: function (date) {
        const obj = date === undefined ? timezone.tz(LOCAL) : timezone.tz(date, LOCAL)

        return obj.isoWeek()
    },
    timestamp: function () {
        return timezone.tz(LOCAL).format()
    },
    minutes: function (minutes) {
        return minutes * MINUTE
    },
    hours: function (hours) {
        return hours * HOUR
    },
    days: function (days) {
        return days * DAY
    },
    secondsToMilli: function (value) {
        return value * 1000
    },
    unix: function (string) {
        return string === undefined ? timezone.tz(LOCAL).unix() * 1000 : timezone.tz(string, LOCAL).unix() * 1000
    },
    sleep: function (milliseconds) {
        return new Promise((res) => setTimeout(() => res(), milliseconds))
    }
}
