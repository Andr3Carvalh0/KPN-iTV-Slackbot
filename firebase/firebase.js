const render = require('./render/render.js')
const repository = require('./data/repository.js')

module.exports = {
    fetch: function () {
        return new Promise((res, rej) => {
            repository.process()
                .then(data => res(render.render(data)))
                .catch(error => rej(error))
        })
    }
}
