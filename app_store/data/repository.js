const appstore = require('./remote/appstore.js')
const configuration = require('./../../configuration/configurations.js')
const repository = require('./../../core/store/repository.js')
const time = require('./../../utilities/time/time.js')
const translator = require('./../../translate/manager.js')

const APP_STORE_ID = configuration.APP_STORE_APPLICATION_ID
const PLATFORM = repository.IOS

function translate(items, commit) {
    return new Promise((resolve, reject) => {
        translator.translate(items)
            .then((data) => {
                data.forEach((item, index) => {
                    if (item.translated) {
                        commit(index, item.text)
                    }
                })

                resolve()
            })
            .catch(() => reject(`iOS failed to translate`))
    })
}

module.exports = {
    rating: function (options) {
        return repository.rating(() => appstore.rating(APP_STORE_ID), PLATFORM, options)
    },
    reviews: function (options) {
        return repository.reviews(
            {
                fetch: (amount) => appstore.reviews(APP_STORE_ID, amount),
                remote: (e) => {
                    return {
                        id: e.id,
                        name: e.userName === undefined ? repository.UNKNOWN : e.userName,
                        title: {original: e.title},
                        review: {original: e.text},
                        date: time.unix(),
                        rating: e.scoreText,
                        version: e.version === undefined ? repository.UNKNOWN : e.version
                    }
                },
                database: (e) => {
                    return {
                        id: e.id,
                        name: e.name,
                        title: e.title,
                        review: e.review,
                        date: e.date,
                        rating: e.rating,
                        version: e.version
                    }
                },
                translate: (items) => {
                    return new Promise((resolve, reject) => {
                        Promise.allSettled([
                            translate(items.map(e => e.review.original), (index, translation) => items[index].review.translated = translation),
                            translate(items.map(e => e.title.original), (index, translation) => items[index].title.translated = translation)
                        ])
                            .then(() => resolve(items))
                            .catch((error) => reject(error))
                    })
                }
            },
            options,
            PLATFORM
        )
    },
    mostRecentReleasesRating: function (options) {
        return repository.mostRecentReleasesRating(options, PLATFORM)
    },
    histogramForRelease: function (version) {
        return repository.histogramForRelease(version, PLATFORM)
    },
    version: function () {
        return repository.version(PLATFORM)
    },
    findReview: function (reviewId) {
        return repository.findReview(reviewId, PLATFORM)
    }
}
