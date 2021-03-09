const base = require('./base/common.js')
const configuration = require('./../../configuration/configurations.js')

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
        if (configuration.SIMPLE_MODE) {
            next()
        } else {
            base.handle(modules, req, res, next)
        }
    }
}
