const builds = require('./../../../builds/render/builds.js')
const configuration = require('./../../../configuration/configurations.js')
const log = require('./../../../utilities/debug/logger.js')
const network = require('./../../../utilities/slack/manager.js')
const platform = require('./../../../builds/platform.js')
const search = require('./../../../search/search.js')
const upload = require('./../utilities/uploader.js')

function notify(channel, body) {
    return network.post(channel, body)
}

const TAG = 'build.js'

function handleBuildResults(body, url) {
    return notify(configuration.BUILDS_CHANNEL, builds.build(body, url, false))
}

module.exports = {
    process: function (req) {
        return req.header('X-iTV-Event') === 'Build Report'
    },
    handle: function (req, res, next) {
        upload.upload(req, res, {
            transform: (req) => {
                // Depending on how its sent we might need to parse the json body
                try {
                    return JSON.parse(req.body.message)
                } catch (e) {
                    return req.body.message
                }
            },
            fallback: (body) => body.download,
            prefix: platform.APP,
            directory: configuration.APK_DIRECTORY,
            extension: configuration.APK_FILE_EXTENSION
        }, (minimized, url, body) => {
            search.process({
                "branch": body.branch,
                "type": body.variant,
                "version": body.versionName,
                "code": body.versionCode,
                "changelog": body.changelog,
                "url": minimized,
                "isTV": false
            })
                .then(() => {
                    handleBuildResults(body, url)
                        .then(() => {
                            log.i(TAG, `Build Report: ok`)
                            res.status(200).json({message: `Build Report: ok`})
                        })
                        .catch((err) => {
                            log.e(TAG, err)
                            res.status(500)
                            next()
                        })
                })
        })
    }
}
