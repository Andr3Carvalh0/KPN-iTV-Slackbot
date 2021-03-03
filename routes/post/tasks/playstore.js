const playstore = require('./../../../schedule/modules/playstore.js')

module.exports = {
    process: function (req) {
        return req.header('X-iTV-Event') === 'Scheduler Task' && req.body.type === 'android'
    },
    handle: function (req, res, next) {
        playstore.execute()
        res.json({message: `Play Store Rating & Reviews task: started!`})
    }
}
