const base = require('./base/common.js')

const modules = [
    require('./modules/exception.js'),
    require('./modules/upload.js'),
    require('./tasks/playstore.js'),
    require('./tasks/appstore.js'),
    require('./tasks/firebase.js'),
    require('./tasks/halo.js'),
    require('./tasks/maintenance.js'),
    require('./tasks/reports.js'),
    require('./tasks/rollout.js')
]

module.exports = {
    handle: function (req, res, next) {
        base.handle(modules, req, res, next)
    }
}
