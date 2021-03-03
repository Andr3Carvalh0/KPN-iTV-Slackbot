const rollout = require('./../../../schedule/modules/rollout.js')

module.exports = {
    process: function (req) {
        return req.header('X-iTV-Event') === 'Scheduler Task' && req.body.type === 'rollout'
    },
    handle: function (req, res, next) {
        rollout.execute()
        res.json({message: `Play Store Rollout task: started!`})
    }
}
