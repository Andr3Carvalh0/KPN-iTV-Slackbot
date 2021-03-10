const base = require('./base/common.js')

const modules = [
    require('./modules/merge.js'),
    require('./modules/notes.js')
]

module.exports = {
    handle: function (req, res, next) {
        base.handle(modules, req, res, next)
    }
}
