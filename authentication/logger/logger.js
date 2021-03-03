const location = require('./../methods/ip.js')
const log = require('./../../utilities/debug/logger.js')

const TAG = 'authentication_logger.js'

const AUTH_HEADER = 'X-iTV-Token'
const GITLAB_AUTH_HEADER = 'X-Gitlab-Token'
const SLACK_TIMESTAMP_HEADER = 'x-slack-request-timestamp'
const SLACK_TOKEN = 'x-slack-signature'

function headers(req) {
    const items = [
        req.header(AUTH_HEADER) !== undefined ? `${AUTH_HEADER}: ${req.header(AUTH_HEADER)}` : undefined,
        req.header(GITLAB_AUTH_HEADER) !== undefined ? `${GITLAB_AUTH_HEADER}: ${req.header(GITLAB_AUTH_HEADER)}` : undefined,
        req.header(SLACK_TOKEN) !== undefined ? `${SLACK_TOKEN}: ${req.header(SLACK_TOKEN)}` : undefined,
        req.header(SLACK_TIMESTAMP_HEADER) !== undefined ? `${SLACK_TIMESTAMP_HEADER}: ${req.header(SLACK_TIMESTAMP_HEADER)}` : undefined
    ]
        .filter(e => e !== undefined)

    return items.length === 0 ? undefined : `[${items.join(' | ')}]`
}

module.exports = {
    run: function (req) {
        log.w(TAG, `${req.method} '${req.originalUrl}'${headers(req) !== undefined ? " " + headers(req) : ""} from ${location.ip(req)}`)
    }
}
