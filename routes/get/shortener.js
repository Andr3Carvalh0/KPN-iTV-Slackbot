const files = require('./../../utilities/filesystem/filesystem.js')
const log = require('./../../utilities/debug/logger.js')
const urls = require('./../../urls/manager.js')

const TAG = 'shortener.js'

function isUserCall(req) {
    return req.header('accept-encoding') !== undefined && req.header('accept-encoding') !== 'identity'
}

function handleRouting(id, isAuthenticated, req, res, next) {
    const file = urls.full(id)

    if (file !== undefined) {
        const fileId = files.item(file.original)

        if (isUserCall(req)) {
            log.d(TAG, `Increasing url click count!`)
            urls.increment(id)
        }

        if (!files.exists(file.original) || !isAuthenticated) {
            if (isUserCall(req)) {
                if (isAuthenticated) {
                    log.e(TAG, `The file "${fileId}" doesn't exist.`)
                }
            }

            if (file.fallback !== "") {
                if (isUserCall(req)) {
                    if (!isAuthenticated) {
                        log.e(TAG, `Routing user to AppCenter since no authentication was provided!`)
                    }

                    log.i(TAG, `Replying request "${fileId}" with the fallback url.`)
                }
                res.redirect(file.fallback)
            } else {
                next()
            }
        } else {
            if (isUserCall(req)) {
                log.i(TAG, `Sending "${fileId}" back!`)
            }

            if (fileId.includes('.html')) {
                res.sendFile(files.fullpath(file.original))
            } else {
                res.download(file.original, fileId)
            }
        }
    } else {
        next()
    }
}

module.exports = {
    handle: function (req, res, next) {
        handleRouting(req.params.resource, true, req, res, next)
    },
    handleWithoutAuthentication: function (req, res, next) {
        handleRouting(req.params.resource, false, req, res, next)
    }
}
