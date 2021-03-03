const log = require('./../../../utilities/debug/logger.js')
const repository = require('./../../../firebase/exceptions/exceptions.js')

const TAG = 'exception.js'

module.exports = {
    process: function (req) {
        return req.header('X-iTV-Event') === 'Index Exception' && req.body !== undefined
    },
    handle: function (req, res, next) {
        repository.add(req.body.file, req.body.cause)
            .then(() => {
                log.i(TAG, `Added ${req.body.file} to the list of known exceptions`)
                res.status(500)
                next()
            })
    }
}
