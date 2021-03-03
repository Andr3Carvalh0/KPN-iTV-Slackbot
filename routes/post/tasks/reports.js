const reports = require('./../../../schedule/modules/reports.js')

module.exports = {
    process: function (req) {
        return req.header('X-iTV-Event') === 'Scheduler Task' && req.body.type === 'reports'
    },
    handle: function (req, res, next) {
        reports.execute()
        res.json({message: `Friday Reports task: started!`})
    }
}
