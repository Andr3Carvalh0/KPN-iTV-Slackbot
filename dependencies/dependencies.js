const version = require('./../package.json');

const router = new Map(
    [
        ['ktlint', '0.41.0'],
        ['frits', version.version]
    ]
)

module.exports = {
    search: function (dependency) {
        if (router.has(dependency)) {
            return router.get(dependency)
        }

        throw new Error('Unknown command.')
    }
}
