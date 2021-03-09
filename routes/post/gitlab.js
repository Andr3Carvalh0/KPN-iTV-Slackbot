const base = require('./base/common.js')
const configuration = require('./../../configuration/configurations.js')

const modules = [
    require('./modules/merge.js'),
    require('./modules/notes.js')
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
