const manager = require('./../../../core/store/data/database.js')
const platform = require('./../../../core/platforms.js')

const PLATFORM = platform.IOS

module.exports = {
    initialize: function (instance) {
        manager.initialize(instance, PLATFORM)
    },
    tag: function () {
        return 'app_store'
    },
    rating: function () {
        return manager.rating(PLATFORM)
    },
    reviews: function () {
        return manager.reviews(PLATFORM)
    },
    version: function () {
        return manager.version(PLATFORM)
    },
    updateVersionNumber: function (version) {
        manager.updateVersionNumber(version, PLATFORM)
    },
    updateRatingValue: function (value, previous, detailed) {
        manager.updateRatingValue(value, previous, detailed, PLATFORM)
    },
    hasReview: function (predicate) {
        return manager.hasReview(predicate, PLATFORM)
    },
    updateReviews: function (reviews) {
        manager.updateReviews(reviews, PLATFORM)
    },
    findReview: function (reviewId) {
        return manager.findReview(reviewId, PLATFORM)
    }
}
