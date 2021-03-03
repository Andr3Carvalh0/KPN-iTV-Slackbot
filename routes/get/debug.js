const configuration = require('./../../configuration/configurations.js')
const files = require('./../../utilities/filesystem/filesystem.js')
const log = require('./../../utilities/debug/logger.js')

const router = new Map(
    [
        ["messages", (req, res) => {
            const message = files.read(configuration.LOGS_FILE).toString().split(/\n/g).filter(s => s !== "")
            const errors = files.read(configuration.ERRORS_FILE).toString().split(/\n/g).filter(s => s !== "").map(e => `pm2: ${e}`)

            res.json({
                d: message.filter(e => e.includes('D/')).map(e => e.replace('D/', '')),
                e: message.filter(e => e.includes('E/')).map(e => e.replace('E/', '')).concat(errors),
                i: message.filter(e => e.includes('I/')).map(e => e.replace('I/', '')),
                v: message.filter(e => e.includes('V/')).map(e => e.replace('V/', '')),
                w: message.filter(e => e.includes('W/')).map(e => e.replace('W/', '')),
                wtf: message.filter(e => e.includes('WTF/')).map(e => e.replace('WTF/', ''))
            })
        }]
    ]
)

const TAG = 'debug.js'

module.exports = {
    handle: function (req, res, next) {
        const id = req.params.resource

        if (router.has(id)) {
            log.d(TAG, `Answering call with id=${id}`)
            router.get(id)(req, res)
        } else {
            next()
        }
    }
}
