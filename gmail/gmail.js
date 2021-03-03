const repository = require('./data/repository.js')

module.exports = {
    hasReport: function () {
        return repository.hasReport()
    },
    compose: function (from, to, cc, subject, message) {
        return repository.send(from, to, cc, subject, message)
    }
}
