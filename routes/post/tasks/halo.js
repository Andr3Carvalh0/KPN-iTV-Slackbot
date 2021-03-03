const halo = require('./../../../schedule/modules/halo.js')

module.exports = {
    process: function (req) {
        return req.header('X-iTV-Event') === 'Scheduler Task' && req.body.type === 'halo'
    },
    handle: function (req, res, next) {
        halo.execute()
        res.json({message: `Halo Image Cache task: started!`})
    }
}
