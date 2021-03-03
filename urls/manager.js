const repository = require('./data/local/database.js')
const {nanoid} = require('nanoid')

const MAX_URL_SIZE = 10

module.exports = {
    full: function (url) {
        return repository.findItem(url)
    },
    increment: function (url) {
        repository.updateItem(url)
    },
    short: function (url, fallback) {
        const generated = nanoid(MAX_URL_SIZE)

        repository.writeItem(url, fallback || "", generated)

        return generated
    },
    remove: function (item) {
        repository.removeItem(item)
    }
}
