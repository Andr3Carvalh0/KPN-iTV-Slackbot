const log = require('./../../utilities/debug/logger.js')

const router = new Map(
    [
        ['about', (req, res) => {
            res.json({
                author: 'André Carvalho',
                createAt: '24 June 2020'
            })
        }]
    ]
)

const TAG = 'commands.js'

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
