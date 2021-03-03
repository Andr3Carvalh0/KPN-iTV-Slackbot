module.exports = {
    handle: function (modules, req, res, next) {
        if (req.body === undefined) {
            next()
        }

        const picked = modules.filter(e => (e.process(req)))

        if (picked.length > 0) {
            picked[0].handle(req, res, next)
        } else {
            next()
        }
    }
}
