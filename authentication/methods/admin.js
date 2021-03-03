const configuration = require('./../../configuration/configurations.js')
const tsscmp = require('tsscmp')

const SUPER_SECRET_TOKEN = configuration.ADMIN_SIGNING_SECRET
const AUTH_HEADER = 'X-iTV-Token'

module.exports = {
    isAuthenticated: function (req) {
        return tsscmp(req.header(AUTH_HEADER), SUPER_SECRET_TOKEN)
    }
}
