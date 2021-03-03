const log = require('./../../utilities/debug/logger.js')
const manager = require('./../../builds/commits/manager.js')

const TAG = 'commits.js'

module.exports = {
    handle: function (req, res, next) {
        const branch = req.params.branch
        const platform = req.params.platform

        log.d(TAG, `Answering api call with branch=${branch}, platform=${platform}`)

        res.send(`${manager.fetch(branch, platform)}`)
    }
}
