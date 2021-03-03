const builds = require('./../../../builds/render/builds.js')
const configuration = require('./../../../configuration/configurations.js')
const log = require('./../../../utilities/debug/logger.js')
const network = require('./../../../utilities/slack/manager.js')

function notify(channel, body) {
    return network.post(channel, body)
}

const TAG = 'tests.js'

function handleTestResults(body) {
    return notify(configuration.TESTS_CHANNEL, builds.tests(body))
}

module.exports = {
    process: function (req) {
        return req.header('X-iTV-Event') === 'Unit Tests'
    },
    handle: function (req, res, next) {
        handleTestResults(req.body)
            .then(() => {
                log.i(TAG, 'Tests Report: ok')
                res.status(200).json({message: `Tests Report: ok`})
            })
            .catch((err) => {
                log.e(TAG, err)
                res.status(500)
                next()
            })
    }
}
