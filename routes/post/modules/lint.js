const configuration = require('./../../../configuration/configurations.js')
const log = require('./../../../utilities/debug/logger.js')
const manager = require('./../../../builds/lint/manager.js')
const network = require('./../../../utilities/slack/manager.js')
const time = require('./../../../utilities/time/time.js')
const upload = require('./../utilities/uploader.js')

function notify(channel, body) {
    return network.post(channel, body)
}

function process(path, url) {
    return new Promise((res, rej) => {
        manager.handle(path, url)
            .then((view) => {
                notify(configuration.TESTS_CHANNEL, view)
                    .then(() => res())
                    .catch((error) => rej(error))
            })
            .catch((error) => rej(error))
    })
}

const TAG = 'lint.js'

module.exports = {
    process: function (req) {
        return req.header('X-iTV-Event') === 'Lint Report'
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
            fallback: (body) => "",
            name: (file, extension, prefix, count, body) => `report_${body.branch}_${time.now('DD_MM_HH_mm')}.${extension}`,
            prefix: undefined,
            directory: configuration.LINT_DIRECTORY,
            extension: configuration.LINT_FILE_EXTENSION
        }, (minimized, url, body, filepath) => {
            process(filepath, url)
                .then(() => {
                    log.i(TAG, `Lint Report: ok`)
                    res.status(200).json({message: `Lint Report: ok`})
                })
                .catch((err) => {
                    log.e(TAG, err)
                    res.status(500)
                    next()
                })
        })
    }
}
