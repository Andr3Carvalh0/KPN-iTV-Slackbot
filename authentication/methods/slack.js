const configuration = require('./../../configuration/configurations.js')
const crypto = require('crypto')
const timer = require('./../../utilities/time/time.js')
const tsscmp = require('tsscmp')

const TIMESTAMP_HEADER = 'x-slack-request-timestamp'
const TOKEN = 'x-slack-signature'

module.exports = {
    isAuthenticated: function (req) {
        if (req.header(TOKEN) === undefined || req.rawBody === undefined) {
            return false
        }

        const time = req.header(TIMESTAMP_HEADER)

        if (time - timer.unix() > timer.minutes(5)) {
            // The request timestamp is more than five minutes from local time.
            // It could be a replay attack, so let's ignore it.
            return false
        }

        const body = req.rawBody

        const [version, hash] = req.header(TOKEN).split('=');
        const key = `${version}:${time}:${body}`

        const generated = crypto.createHmac("sha256", configuration.SLACK_SIGNING_SECRET)
            .update(key)
            .digest("hex");

        return tsscmp(hash, generated)
    }
}
