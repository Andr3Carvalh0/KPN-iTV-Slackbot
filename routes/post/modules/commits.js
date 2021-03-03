const log = require('./../../../utilities/debug/logger.js')
const manager = require('./../../../builds/commits/manager.js')

const TAG = 'commits.js'

function handleCommit(body) {
    return new Promise((res, rej) => {
        manager.update(body.branch, body.platform, body.hash)
        res()
    })
}

module.exports = {
    process: function (req) {
        return req.header('X-iTV-Event') === 'Commit Report'
    },
    handle: function (req, res, next) {
        handleCommit(req.body)
            .then(() => {
                log.i(TAG, 'Commit Report: ok')
                res.status(200).json({message: `Commit Report: ok`})
            })
            .catch((err) => {
                log.e(TAG, err)
                res.status(500)
                next()
            })
    }
}
