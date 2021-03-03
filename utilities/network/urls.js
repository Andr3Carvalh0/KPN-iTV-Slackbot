const BASE_URL = require('./../../configuration/configurations').BASE_URL
const PROTOCOL = require('./../../configuration/configurations').HTTP_PROTOCOL

module.exports = {
    path: function (path) {
        return `${PROTOCOL}://${BASE_URL}${path}`
    }
}
