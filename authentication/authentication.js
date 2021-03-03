const authenticationLogger = require('./logger/logger.js')
const headers = require('./methods/headers.js')
const location = require('./methods/ip.js')
const master = require('./methods/admin.js')
const slack = require('./methods/slack.js')

const LEVEL_ROUTER = [
    (req) => req.isAdmin,
    (req) => req.isHeaderAuthenticated,
    (req) => req.isSlackAuthenticated,
    (req) => req.isLocationAuthenticated,
    (req) => req.isHeaderAuthenticated || req.isLocationAuthenticated,
    (req) => req.isHeaderAuthenticated || req.isSlackAuthenticated || req.isLocationAuthenticated,
    (req) => true
]

module.exports = {
    authenticate: function (req, res, next) {
        authenticationLogger.run(req)

        req.isAdmin = master.isAuthenticated(req)
        req.isHeaderAuthenticated = headers.isAuthenticated(req)
        req.isSlackAuthenticated = slack.isAuthenticated(req)
        req.isLocationAuthenticated = location.isWhitelisted(req)

        next()
    },
    verify: function (req, res, next, level, action) {
        if (LEVEL_ROUTER[level](req)) {
            action(req, res, next)
        } else {
            next()
        }
    },
    ADMIN: 0,
    HEADER: 1,
    SLACK: 2,
    LOCATION: 3,
    RESOURCES: 4,
    ALL: 5,
    NONE: 6
}
