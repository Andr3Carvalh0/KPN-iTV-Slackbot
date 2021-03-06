const platforms = require('./../../../core/platforms.js')

let database

const ANDROID_LAST_WEEK_RATING_NAME = 'ANDROID_LAST_WEEK_RATING'
const ANDROID_LAST_WEEK_CRASHES_NAME = 'ANDROID_LAST_WEEK_CRASHES'
const IOS_LAST_WEEK_RATING_NAME = 'IOS_LAST_WEEK_RATING'
const IOS_LAST_WEEK_CRASHES_NAME = 'IOS_LAST_WEEK_CRASHES'

// Related to tracking of the on going play store rating change
const MESSAGES_NAME = 'MESSAGES'
const LAST_SENT_RATING_NAME = 'LAST_SENT_RATING'

const PLATFORM_ANDROID = platforms.ANDROID

module.exports = {
    initialize: function (instance) {
        database = instance

        database.defaults({
            ANDROID_LAST_WEEK_RATING: "",
            ANDROID_LAST_WEEK_CRASHES: "",
            IOS_LAST_WEEK_RATING: "",
            IOS_LAST_WEEK_CRASHES: "",
            MESSAGES: [],
            LAST_SENT_RATING: {
                previous: "",
                current: "",
                detail: ""
            }
        }).write()
    },
    tag: function () {
        return 'reports'
    },
    rating: function (platform) {
        return database.get(platform === PLATFORM_ANDROID ? ANDROID_LAST_WEEK_RATING_NAME : IOS_LAST_WEEK_RATING_NAME).cloneDeep().value()
    },
    updateRatingValue: function (value, platform) {
        database.set(platform === PLATFORM_ANDROID ? ANDROID_LAST_WEEK_RATING_NAME : IOS_LAST_WEEK_RATING_NAME, value).write()
    },
    crashes: function (platform) {
        return database.get(platform === PLATFORM_ANDROID ? ANDROID_LAST_WEEK_CRASHES_NAME : IOS_LAST_WEEK_CRASHES_NAME).cloneDeep().value()
    },
    updateCrashesValue: function (value, platform) {
        database.set(platform === PLATFORM_ANDROID ? ANDROID_LAST_WEEK_CRASHES_NAME : IOS_LAST_WEEK_CRASHES_NAME, value).write()
    },
    pushMessage: function (message) {
        database.get(MESSAGES_NAME)
            .push(message)
            .write()
    },
    messages: function () {
        return database.get(MESSAGES_NAME).cloneDeep().value()
    },
    clearMessages: function () {
        database.get(MESSAGES_NAME)
            .remove(() => true)
            .write()
    },
    updateLastSentRating: function (value) {
        database.set(LAST_SENT_RATING_NAME, value).write()
    },
    lastSentRating: function () {
        return database.get(LAST_SENT_RATING_NAME).cloneDeep().value()
    }
}
