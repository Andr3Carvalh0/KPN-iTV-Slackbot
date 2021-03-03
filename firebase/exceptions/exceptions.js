const random = require('./../../utilities/others/randomizer.js')
const repository = require('./data/repository.js')

const DEFAULT_CAUSE = `Device's OS issue`
const EASTER_EGG_CAUSE = `André did an ahah oopsie, probably`

const EASTER_EGG_MIN_BOUND = 0
const EASTER_EGG_MAX_BOUND = 10
const EASTER_EGG_THRESHOLD = 3

module.exports = {
    issue: function (exception) {
        if (exception.line === -1) {
            return DEFAULT_CAUSE
        }

        const i = repository.issue(exception)

        if (i === undefined && random.generate(EASTER_EGG_MIN_BOUND, EASTER_EGG_MAX_BOUND) < EASTER_EGG_THRESHOLD) {
            return EASTER_EGG_CAUSE
        }

        return i
    },
    add: function (key, reason) {
        return repository.add(key, reason)
    }
}
