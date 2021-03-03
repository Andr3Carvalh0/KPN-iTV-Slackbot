const builds = require('./../../../builds/render/builds.js')
const configuration = require('./../../../configuration/configurations.js')
const log = require('./../../../utilities/debug/logger.js')
const network = require('./../../../utilities/slack/manager.js')

function notify(channel, body) {
    return network.post(channel, body)
}

const TAG = 'error.js'

function handleError(body) {
    return new Promise((res, rej) => {
        builds.error(body).then((view) => {
            notify(configuration.BUILDS_CHANNEL, view)
                .then((data) => res(data))
                .catch((error) => rej(error))
        })
    })
}

module.exports = {
    process: function (req) {
        return req.header('X-iTV-Event') === 'Error Report'
    },
    handle: function (req, res, next) {
        handleError(req.body)
            .then(() => {
                log.i(TAG, 'Error Report: ok')
                res.status(200).json({message: `Error Report: ok`})
            })
            .catch((err) => {
                log.e(TAG, err)
                res.status(500)
                next()
            })
    }
}
