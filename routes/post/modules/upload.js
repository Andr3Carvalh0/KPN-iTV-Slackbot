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

const TAG = 'upload.js'
const TV_KEYWORD = 'tv'

function handleManualBuildResults(body, url, channel) {
    return notify(channel, builds.manual(body, url))
}

const channelRouter = new Map([
    ["builds", configuration.BUILDS_CHANNEL],
    ["release", configuration.RELEASE_CHANNEL],
    ["team", configuration.TEAMS_CHANNEL],
    ["tests", configuration.TESTS_CHANNEL],
    ["tv", configuration.ANDROID_TV_CHANNEL]
])

module.exports = {
    process: function (req) {
        return req.header('X-iTV-Event') === 'Manual Build Report'
    },
    handle: function (req, res, next) {
        upload.upload(req, res, {
            transform: (req) => req.body,
            fallback: () => "",
            prefix: platform.MANUAL,
            directory: configuration.APK_DIRECTORY,
            extension: configuration.APK_FILE_EXTENSION
        }, (minimized, url, body) => {
            const information = {
                "variant": body.variant,
                "versionName": body.versionName,
                "versionCode": body.versionCode,
                "changelog": body.changelog,
                "brand": body.brand
            }

            const flow = body.index ? search.process({
                "branch": body.branch,
                "type": body.variant,
                "version": body.versionName,
                "code": body.versionCode,
                "changelog": body.changelog,
                "url": minimized,
                "isTV": body.channel === TV_KEYWORD
            }) : new Promise((res) => {
                res()
            })

            flow.then(() => {
                handleManualBuildResults(information, url, channelRouter.get(body.channel))
                    .then(() => {
                        log.i(TAG, 'Manual Build Report: ok')
                        res.status(200).json({message: `Manual Build Report: ok`})
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
