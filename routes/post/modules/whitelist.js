const repository = require('./../../../authentication/location/database.js')

module.exports = {
    process: function (req) {
        return req.body !== undefined && req.body.ip !== undefined && req.header('X-iTV-Event') === 'IP Whitelist Report'
    },
    handle: function (req, res, next) {
        repository.whitelist(req.body.ip)
        res.json({message: `Ip Whitelisted: ok`})
    }
}
