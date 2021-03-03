const base = require('./base/common.js')

const modules = [
    require('./modules/open_reply_modal.js'),
    require('./modules/post_reply.js'),
    require('./modules/search.js')
]

module.exports = {
    handle: function (req, res, next) {
        base.handle(modules, req, res, next)
    }
}
