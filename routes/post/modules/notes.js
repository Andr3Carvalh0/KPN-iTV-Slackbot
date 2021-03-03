const configuration = require('./../../../configuration/configurations.js')
const log = require('./../../../utilities/debug/logger.js')
const network = require('./../../../utilities/slack/manager.js')
const notes = require('./../../../merges/notes.js')

function notify(channel, body) {
    return network.post(channel, body)
}

const TAG = 'notes.js'

function handleNote(body) {
    return notify(configuration.GITLAB_CHANNEL, notes.note(body))
}

module.exports = {
    process: function (req) {
        return req.header('X-Gitlab-Event') === 'Note Hook'
    },
    handle: function (req, res, next) {
        handleNote(req.body)
            .then(() => {
                log.d(TAG, 'Notes: ok')
                res.status(200).json({message: `Notes: ok`})
            })
            .catch((err) => {
                log.e(TAG, err)
                res.status(500)
                next()
            })
    }
}
