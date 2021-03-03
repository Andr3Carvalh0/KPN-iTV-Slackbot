const configuration = require('./../../../configuration/configurations.js')
const log = require('./../../../utilities/debug/logger.js')
const network = require('./../../../utilities/slack/manager.js')
const search = require('./../../../search/search.js')

function notify(url, body) {
    return network.post(url, body)
}

const TAG = 'search.js'

module.exports = {
    process: function (req) {
        return req.body.token === configuration.BUILD_COMMAND_TOKEN && req.body.text.length > 0
    },
    handle: function (req, res, next) {
        const spliced = req.body.text.split(" ")
        const query = (spliced.length > 1) ? spliced.slice(1).join(" ") : ""

        if (query === "") {
            res.send(`Searching... 🔍`)
        } else {
            res.send(`Searching for '${query}'... 🔍`)
        }

        search.query({
            "type": spliced[0],
            "query": query
        })
            .then(data => {
                log.i(TAG, 'Replying to the search query')
                notify(req.body.response_url, data)
                    .then(() => log.i(TAG, 'Search report: ok'))
                    .catch((err) => log.e(TAG, err))
            })
            .catch(err => {
                log.e(TAG, err)
                notify(req.body.response_url, err)
                    .then(() => log.i(TAG, 'Search report: ok'))
                    .catch((err) => log.e(TAG, err))
            })
    }
}
