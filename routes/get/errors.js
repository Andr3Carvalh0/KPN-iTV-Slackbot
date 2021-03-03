const configuration = require('./../../configuration/configurations.js')
const location = require('./../../authentication/methods/ip.js')
const log = require('./../../utilities/debug/logger.js')

const ERROR = `${configuration.RESOURCES_DIRECTORY}public/404.html`
const TAG = 'errors.js'

module.exports = {
    handle: function (req, res, next) {
        log.i(TAG, `Answering call (${req.method} '${req.originalUrl}' from ${location.ip(req)}) with error`)

        if (res.statusCode === 200) {
            res.status(400)
        }

        if (req.header('Content-Type') === 'application/json' || req.header('Content-Type') === undefined) {
            res.json({
                title: "Oops...",
                description: "Something went wrong!"
            })
        } else {
            res.sendFile(ERROR)
        }
    }
}
