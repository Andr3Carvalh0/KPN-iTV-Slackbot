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
                    render.rating({
                        previous: data.previous,
                        current: data.current.value,
                        detail: data.current.detailed
                    }).then((view) => res(view))
                })
                .catch((error) => rej(error))
        })
    },
    reviews: function (options) {
        return new Promise((res, rej) => {
            repository.reviews(options)
                .then((data) => {
                    Promise.allSettled(data.map(e => classify(e)))
                        .then((results) => res(results.map(e => render.reviews(configuration.APP_STORE_APPLICATION_ID, e.value))))
                        .catch(() => res(data.map(e => render.reviews(configuration.APP_STORE_APPLICATION_ID, e))))
                })
                .catch((error) => rej(error))
        })
    },
    version: function () {
        return repository.version()
    }
}
