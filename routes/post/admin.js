const base = require('./base/common.js')

const modules = [
    require('./modules/whitelist.js')
]

module.exports = {
    handle: function (req, res, next) {
        base.handle(modules, req, res, next)
    }
}
