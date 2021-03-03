const appstore = require('./../../../schedule/modules/appstore.js')

module.exports = {
    process: function (req) {
        return req.header('X-iTV-Event') === 'Scheduler Task' && req.body.type === 'ios'
    },
    handle: function (req, res, next) {
        appstore.execute()
        res.json({message: `App Store Reviews task: started!`})
    }
}
