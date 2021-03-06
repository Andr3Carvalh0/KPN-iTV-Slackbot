const platforms = require('./../../../core/platforms.js')

let androidDatabase
let iOSDatabase

const RATING_TABLE_NAME = 'RATING'
const REVIEWS_TABLE_NAME = 'REVIEWS'
const VERSION_TABLE_NAME = 'VERSION'

const PLATFORM_ANDROID = platforms.ANDROID

function database(platform) {
    return platform === PLATFORM_ANDROID ? androidDatabase : iOSDatabase
}

module.exports = {
    initialize: function (instance, platform) {
        if (platform === PLATFORM_ANDROID) {
            androidDatabase = instance
        } else {
            iOSDatabase = instance
        }

        database(platform).defaults({
            RATING: {
                previous: "",
                current: {
                    value: "",
                    detailed: ""
                }
            },
            REVIEWS: [],
            VERSION: ""
        }).write()
    },
    rating: function (platform) {
        return database(platform).get(RATING_TABLE_NAME).cloneDeep().value()
    },
    reviews: function (platform) {
        return database(platform).get(REVIEWS_TABLE_NAME).cloneDeep().value()
    },
    version: function (platform) {
        return database(platform).get(VERSION_TABLE_NAME).cloneDeep().value()
    },
    updateVersionNumber: function (version, platform) {
        database(platform).set(VERSION_TABLE_NAME, version).write()
    },
    updateRatingValue: function (value, previous, detailed, platform) {
        const rating = database(platform).get(RATING_TABLE_NAME).value()

        rating.previous = previous
        rating.current.value = value
        rating.current.detailed = detailed

        database(platform).get(RATING_TABLE_NAME).write()
    },
    hasReview: function (predicate, platform) {
        const reviews = database(platform).get(REVIEWS_TABLE_NAME)
            .filter((e) => predicate(e))
            .value()

        return reviews !== undefined && reviews.length > 0
    },
    updateReviews: function (reviews, platform) {
        const items = database(platform).get(REVIEWS_TABLE_NAME).value()

        reviews.forEach(e => {
            items.push(e)
        })

        database(platform).get(REVIEWS_TABLE_NAME).write()
    },
    findReview: function (reviewId, platform) {
        return database(platform).get(REVIEWS_TABLE_NAME)
            .filter((e) => e.id === reviewId)
            .cloneDeep()
            .value()
    }
}
