const database = require('./data/database.js')
const math = require('./../../utilities/math/math.js')
const platforms = require('./../platforms.js')
const time = require('./../../utilities/time/time.js')

const MAX_DECIMAL_DIGITS_RATING = 3
const MAX_VERSIONS = 3
const ANDROID_MIN_REVIEWS = 50
const IOS_MIN_REVIEWS = 10
const UNKNOWN = 'unknown'
const AMOUNT_REVIEWS = 20
const DAYS_TO_DISCARD_REPLIES = 31

function reduce(items) {
    const it = []

    items.forEach(e => {
        if (!it.includes(e.version)) {
            it.push(e.version)
        }
    })

    return it
}

function normalize(rating) {
    const value = (rating === UNKNOWN ? "1.0" : rating).split(".")

    return value.map((v, i) => parseInt(v) >= 10 ? 9.9 : parseInt(v) * parseInt(`1${"0".repeat(value.length - 1 - i)}`))
        .reduce((v1, v2) => v1 + v2, 0)
}

function isUpdate(reviewTime, id, platform) {
    if (database.hasReview(e1 => id !== undefined && id === e1.id, platform)) {
        const previous = database.findReview(id, platform)

        return reviewTime - previous[previous.length - 1].date <= time.days(DAYS_TO_DISCARD_REPLIES)
    } else {
        return false
    }
}

function previous(reviewTime, id, platform) {
    const tmp = database.findReview(id, platform)

    return isUpdate(reviewTime, id, platform) ? tmp[tmp.length - 1] : undefined
}

module.exports = {
    rating: function (promise, platform, options) {
        return new Promise((res, rej) => {
            const fetchLocal = options === undefined ? false : options.local || false

            if (fetchLocal) {
                res(database.rating(platform))
            } else {
                promise()
                    .then((data) => {
                        let hasChanged = false
                        let rating = database.rating(platform)
                        rating.current.detailed = `${data.score.toFixed(MAX_DECIMAL_DIGITS_RATING)}`

                        database.updateVersionNumber(data.version, platform)

                        if (rating.current.value !== data.scoreText) {
                            rating.previous = (rating.current.value === '') ? data.scoreText : rating.current.value
                            rating.current.value = data.scoreText

                            hasChanged = true
                        }

                        database.updateRatingValue(rating.current.value, rating.previous, rating.current.detailed, platform)

                        if (rating.current.value !== rating.previous && hasChanged) {
                            res(rating)
                        } else {
                            rej("Rating hasn't change")
                        }
                    })
                    .catch((err) => rej(err))
            }
        })
    },
    reviews: function (mappers, options, platform) {
        return new Promise((res, rej) => {
            const fetchLocal = options === undefined ? false : (options.local === undefined ? false : options.local)

            if (fetchLocal) {
                res(database.reviews(platform))
            } else {
                mappers.fetch(AMOUNT_REVIEWS)
                    .then(data => {
                        const items = data.data
                            .map(e => mappers.remote(e))
                            .filter(e => !database.hasReview(e1 => e.name === e1.name && e.review.original === e1.review.original && e.rating === e1.rating, platform))
                            .map(e => {
                                e.previous = previous(e.date, e.id, platform)

                                return e
                            })
                            .reverse()

                        if (items.length > 0) {
                            mappers.translate(items)
                                .then((data) => {
                                    database.updateReviews(data.map(e => mappers.database(e)), platform)
                                    res(data)
                                })
                                .catch((error) => rej(`${error}`))
                        } else {
                            rej(`No new ${platform === platforms.ANDROID ? "Android" : "iOS"} reviews`)
                        }
                    }).catch((err) => rej(err))
            }
        })
    },
    mostRecentReleasesRating: function (options, platform) {
        const opts = {
            anyAmount: options.anyAmount || false,
            version: options.version || undefined
        }

        return new Promise((res) => {
            const data = database.reviews(platform)

            const items = data.map(e => {
                return {
                    name: e.name,
                    rating: e.rating,
                    versionLong: normalize(e.version),
                    version: e.version
                }
            })

            const versions = reduce(items.sort((e1, e2) => e2.versionLong - e1.versionLong)).splice(0, MAX_VERSIONS)

            const maps = items.filter(e => versions.includes(e.version))
                .reduce((map, item) => {
                    if (map.has(item.version)) {
                        const data = map.get(item.version)

                        data.count = data.count + 1
                        data.histogram[parseInt(item.rating) - 1] = data.histogram[parseInt(item.rating) - 1] + 1

                        map.set(item.version, data)
                    } else {
                        const data = [0, 0, 0, 0, 0]
                        data[parseInt(item.rating) - 1] = 1

                        map.set(item.version, {
                            count: 1,
                            histogram: data
                        })
                    }

                    return map
                }, new Map())

            const result = []

            const minReviews = platform === platforms.ANDROID ? ANDROID_MIN_REVIEWS : IOS_MIN_REVIEWS

            maps.forEach((v, key) => {
                if (opts.anyAmount || v.count >= minReviews || opts.version === key) {
                    result.push(
                        {
                            version: key,
                            average: math.average(
                                v.histogram.map((e, index) => e * (index + 1)),
                                v.histogram.reduce((a, b) => a + b, 0),
                            ),
                            mode: math.mode(v.histogram) + 1,
                            histogram: v.histogram
                        }
                    )
                }
            })

            res(result)
        })
    },
    histogramForRelease: function (version, platform) {
        return new Promise((res, rej) => {
            this.mostRecentReleasesRating({
                anyAmount: true
            }, platform).then((data) => {
                const result = data.filter(e => e.version === version)

                if (result.length === 0) {
                    rej('We have no information about this release.')
                } else {
                    res({
                        'version': version,
                        'data': result[0].histogram
                    })
                }
            }).catch((err) => rej(err))
        })
    },
    version: function (platform) {
        return database.version(platform)
    },
    findReview: function (reviewId, platform) {
        return new Promise((res, rej) => {
            const reviews = database.findReview(reviewId, platform)

            if (reviews === undefined || reviews.length === 0) {
                rej(`Cannot find review with it ${reviewId}`)
            } else {
                res(reviews[reviews.length - 1])
            }
        })
    },
    UNKNOWN: 'unknown'
}
