const configuration = require('./../../../configuration/configurations.js')
const log = require('./../../../utilities/debug/logger.js')
const manager = require('./../../../play_store/releases/manager.js')
const network = require('./../../../utilities/slack/manager.js')

function notify(channel, body) {
    return network.post(channel, body)
}

const TAG = 'render.js'

const DEFAULT_ROLLOUT = '0.3'

function handleRelease(body) {
    return new Promise((res, rej) => {
        manager.release(body.name, body.code, parseFloat(body.percentage || DEFAULT_ROLLOUT), [body.nl, body.en]).then((view) => {
            notify(configuration.RELEASE_CHANNEL, view)
                .then((data) => res(data))
                .catch((error) => rej(error))
        })
    })
}

module.exports = {
    process: function (req) {
        return req.header('X-iTV-Event') === 'Release Report'
    },
    handle: function (req, res, next) {
        handleRelease(req.body)
            .then(() => {
                log.i(TAG, 'Release Report: ok')
                res.status(200).json({message: `Release Report: ok`})
            })
            .catch((err) => {
                log.e(TAG, err)
                res.status(500)
                next()
            })
    }
}
