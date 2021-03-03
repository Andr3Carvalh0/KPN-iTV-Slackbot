const firebase = require('./../../../schedule/modules/firebase.js')

module.exports = {
    process: function (req) {
        return req.header('X-iTV-Event') === 'Scheduler Task' && req.body.type === 'firebase'
    },
    handle: function (req, res, next) {
        firebase.execute()
        res.json({message: `Firebase Alerts & Crashes task: started!`})
    }
}
