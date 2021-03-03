const base = require('./base/common.js')

const modules = [
    require('./modules/build.js'),
    require('./modules/error.js'),
    require('./modules/lint.js'),
    require('./modules/releases.js'),
    require('./modules/tests.js'),
    require('./modules/tv_build.js')
]

module.exports = {
    handle: function (req, res, next) {
        base.handle(modules, req, res, next)
    }
}
