const render = require('./render/render.js')
const repository = require('./data/repository.js')

module.exports = {
    update: function (branch, platform, hash) {
        repository.update(branch, platform, hash)
    },
    fetch: function (branch, platform) {
        return render.render(repository.fetch(branch, platform))
    },
    remove: function (branch, platform) {
        repository.remove(branch, platform)
    }
}
