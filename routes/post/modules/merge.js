const configuration = require('./../../../configuration/configurations.js')
const log = require('./../../../utilities/debug/logger.js')
const merge = require('./../../../merges/merge.js')
const network = require('./../../../utilities/slack/manager.js')

function notify(channel, body) {
    return network.post(channel, body)
}

const TAG = 'merge.js'

function handleMergeRequest(body) {
    let view = undefined

    if (body.object_attributes.action === 'open' || body.object_attributes.action === 'reopen') {
        view = merge.open(body)
    } else if (body.object_attributes.action === 'close') {
        view = merge.close(body)
    } else if (body.object_attributes.action === 'merge') {
        view = merge.approved(body)
    }

    if (view !== undefined) {
        return Promise.allSettled([notify(configuration.BUILDS_CHANNEL, view), notify(configuration.GITLAB_CHANNEL, view)])
    } else {
        return new Promise((res, rej) => rej(`Unknown merge request (${body.object_attributes.action}) action!`))
    }
}

module.exports = {
    process: function (req) {
        return req.header('X-Gitlab-Event') === 'Merge Request Hook'
    },
    handle: function (req, res, next) {
        handleMergeRequest(req.body)
            .then(() => {
                log.d(TAG, 'Merge Request: ok')
                res.status(200).json({message: `Merge Request: ok`})
            })
            .catch((err) => {
                log.e(TAG, err)
                res.status(500)
                next()
            })
    }
}
