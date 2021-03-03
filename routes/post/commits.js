const base = require('./base/common.js')

const modules = [
    require('./modules/commits.js')
]

module.exports = {
    handle: function (req, res, next) {
        base.handle(modules, req, res, next)
    }
}
