const render = require('./render/render.js')
const repository = require('./data/repository.js')

module.exports = {
    isCacheInvalidated: function () {
        return new Promise((res, rej) => {
            repository.cache()
                .then(metadata => render.cache(metadata).then((view) => res(view)))
                .catch((error) => rej(error))
        })
    }
}
