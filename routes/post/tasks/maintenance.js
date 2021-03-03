const maintenance = require('./../../../schedule/modules/maintenance.js')

module.exports = {
    process: function (req) {
        return req.header('X-iTV-Event') === 'Scheduler Task' && req.body.type === 'maintenance'
    },
    handle: function (req, res, next) {
        maintenance.execute()
        res.json({message: `Maintenance task: started!`})
    }
}
