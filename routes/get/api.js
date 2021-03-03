const log = require('./../../utilities/debug/logger.js')
const path = require('./../../utilities/network/urls.js')
const repository = require('./../../search/data/local/database.js')
const textUtilities = require('./../../utilities/strings/text.js')
const timeUtilities = require('./../../utilities/time/time.js')

function handleRequest(isTV) {
    return repository.get()
        .filter(e => e.isTV === isTV)
        .map(e => {
            return {
                branch: e.branch,
                type: e.type,
                version: e.version,
                code: e.code,
                download: path.path(e.url),
                time: timeUtilities.unix(e.timestamp),
                changelog: textUtilities.replace(e.changelog, /\*/g, '')
                    .split('\n')
                    .map(s => s.trim())
                    .filter(s => s !== "")
            }
        })
}

const router = new Map(
    [
        ['tv', (req, res, next) => {
            res.json(handleRequest(true))
        }],
        ['app', (req, res, next) => {
            res.json(handleRequest(false))
        }]
    ]
)

const TAG = 'api.js'

module.exports = {
    handle: function (req, res, next) {
        const id = req.params.type

        if (router.has(id)) {
            log.d(TAG, `Answering api call with id=${id}`)
            router.get(id)(req, res, next)
        } else {
            next()
        }
    }
}
