const dependencies = require('./../../dependencies/dependencies.js')
const log = require('./../../utilities/debug/logger.js')

const TAG = 'version.js'

module.exports = {
    handle: function (req, res, next) {
        try {
            log.d(TAG, 'Answering call!')
            res.send(dependencies.search(req.params.dependency))
        } catch (e) {
            log.e(TAG, e)
            next()
        }
    }
}
