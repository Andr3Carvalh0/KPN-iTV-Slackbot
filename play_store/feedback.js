const configuration = require('./../configuration/configurations.js')
const render = require('./render/render.js')
const repository = require('./data/repository.js')

const category = configuration.USE_MACHINE_LEARNING ? require('./../machine_learning/categories/categories.js') : undefined
const toxicity = configuration.USE_MACHINE_LEARNING ? require('./../machine_learning/toxicity/toxicity.js') : undefined

const THRESHOLD = 0.75

function classify(review) {
    return new Promise((res, rej) => {
        if (configuration.USE_MACHINE_LEARNING) {
            Promise.allSettled([
                category.classify(review.review.translated, THRESHOLD),
                toxicity.isToxic(review.review.translated, THRESHOLD)
            ])
                .then((data) => {
                    const categoryResults = data[0].value
                    const toxicityResults = data[1].value

                    review.category = categoryResults !== undefined ? categoryResults.tag : undefined
                    review.isToxic = toxicityResults.length > 0

                    res(review)
                })
                .catch(() => rej(review))
        } else {
            res(review)
        }
    })
}

module.exports = {
    rating: function (options) {
        return new Promise((res, rej) => {
            repository.rating(options)
                .then((data) => {
                    res({
                            previous: data.previous,
                            current: data.current.value,
                            detail: data.current.detailed
                        }
                    )
                })
                .catch((error) => rej(error))
        })
    },
    reviews: function (options) {
        return new Promise((res, rej) => {
            repository.reviews(options)
                .then((data) => {
                    Promise.allSettled(data.map(e => classify(e)))
                        .then((results) => res(results.map(e => render.reviews(e.value))))
                        .catch(() => res(data.map(e => render.reviews(e))))
                })
                .catch((error) => rej(error))
        })
    },
    reply: function (id, text) {
        return repository.reply(id, text)
    },
    version: function () {
        return repository.version()
    }
}
