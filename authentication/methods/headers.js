const configuration = require('./../../configuration/configurations.js')
const tsscmp = require('tsscmp')

const SUPER_SECRET_TOKEN = configuration.SIGNING_SECRET
const AUTH_HEADER = 'X-iTV-Token'
const GITLAB_AUTH_HEADER = 'X-Gitlab-Token'

module.exports = {
    isAuthenticated: function (req) {
        return tsscmp(req.header(AUTH_HEADER), SUPER_SECRET_TOKEN) ||
            tsscmp(req.header(GITLAB_AUTH_HEADER), SUPER_SECRET_TOKEN)
    }
}
