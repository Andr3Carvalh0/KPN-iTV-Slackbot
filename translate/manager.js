const collections = require('./../utilities/collections/collections.js')
const log = require('./../utilities/debug/logger.js')
const time = require('./../utilities/time/time.js')
const translator = require('./translator.js')

const MAX_TRANSLATION_ATTEMPTS = 5
const RETRY_COOLDOWN = 1500
const SLEEP_COOLDOWN = 5000
const SAMPLE_SIZE = 5
const COOLDOWN_AT = 20
const TAG = "translator.js"

function fetch(texts, promise, attempt, transformed, index) {
    const _try = attempt || 0
    const offset = index || 0
    let processed = transformed || []

    log.d(TAG, `Attempting to translate for ${_try + 1}`)

    translator.translate(collections.chunk(texts, SAMPLE_SIZE)[offset])
        .then(data => {
            processed = processed.concat(data)
            log.d(TAG, `Translations left: ${texts.length - processed.length}`)

            if (processed.length === texts.length) {
                promise.res(processed)
            } else {
                if (processed.length % COOLDOWN_AT === 0) {
                    log.d(TAG, `In cooldown...`)
                    time.sleep(SLEEP_COOLDOWN)
                        .then(() => fetch(texts, promise, 0, processed, offset + 1))
                } else {
                    fetch(texts, promise, 0, processed, offset + 1)
                }
            }
        })
        .catch((error) => {
            if (_try + 1 === MAX_TRANSLATION_ATTEMPTS) {
                promise.rej(error)
            } else {
                time.sleep(RETRY_COOLDOWN)
                    .then(() => fetch(texts, promise, _try + 1, processed, offset))
            }
        })
}

module.exports = {
    translate: function (texts) {
        const data = Array.isArray(texts) ? texts : [texts]

        return new Promise((resolve, reject) => {
            fetch(data, {res: resolve, rej: reject})
        })
    }
}
