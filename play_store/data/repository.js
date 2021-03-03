const androidVersions = require('./../../utilities/os/android.js')
const configuration = require('./../../configuration/configurations.js')
const constants = require('./../constants.js')
const log = require('./../../utilities/debug/logger.js')
const playstore = require('./remote/playstore.js')
const repository = require('./../../core/store/repository.js')
const time = require('./../../utilities/time/time.js')
const translator = require('./../../translate/manager.js')

const PLAY_STORE_ID = configuration.PLAY_STORE_APPLICATION_ID
const PLATFORM = repository.ANDROID

function normalizeDevice(device, manufacturer) {
    manufacturer = manufacturer || ""

    return device.split(' ')
        .filter((e) => e.toLowerCase() !== manufacturer.toLowerCase())
        .filter((e) => !constants.DEVICE_MANUFACTURERS.includes(e.toLowerCase()))
        .join(' ')
        .trim()
}

const TAG = 'repository.js'

module.exports = {
    rating: function (options) {
        return repository.rating(() => playstore.rating(PLAY_STORE_ID), PLATFORM, options)
    },
    reviews: function (options) {
        return repository.reviews(
            {
                fetch: (amount) => playstore.reviews(PLAY_STORE_ID, amount),
                remote: (e) => {
                    return {
                        id: configuration.USE_PLAY_STORE_OAUTH_TO_FETCH_REVIEWS ? e.id : undefined,
                        name: e.userName === undefined ? constants.GOOGLE_USER : e.userName,
                        review: {
                            original: e.text,
                            translated: configuration.USE_PLAY_STORE_OAUTH_TO_FETCH_REVIEWS ? e.translatedText : undefined
                        },
                        date: e.date || time.unix(),
                        rating: e.scoreText,
                        version: e.version === undefined || e.version === null ? repository.UNKNOWN : e.version,
                        device: e.device !== undefined ? normalizeDevice(e.device, e.manufacturer) : undefined,
                        manufacturer: e.manufacturer,
                        os: androidVersions.version(e.os)
                    }
                },
                database: (e) => {
                    return {
                        id: e.id,
                        name: e.name,
                        review: e.review,
                        date: e.date,
                        rating: e.rating,
                        version: e.version,
                        device: e.device,
                        manufacturer: e.manufacturer,
                        os: e.os
                    }
                },
                translate: (items) => {
                    return new Promise((resolve, reject) => {
                        if (configuration.USE_PLAY_STORE_OAUTH_TO_FETCH_REVIEWS) {
                            log.d(TAG, `No need to translate reviews`)
                            resolve(items)
                        } else {
                            translator.translate(items.map(e => e.review.original))
                                .then((data) => {
                                    data.forEach((item, index) => {
                                        if (item.translated) {
                                            items[index].review.translated = item.text
                                        }
                                    })

                                    log.d(TAG, `Translation successful for Android`)
                                    resolve(items)
                                })
                                .catch(() => reject(`Android failed to translate reviews`))
                        }
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
    rollout: function () {
        return new Promise((res, rej) => {
            playstore.rollout(configuration.PLAY_STORE_APPLICATION_ID)
                .then((data) => {
                    res({
                        'name': data.name,
                        'code': data.versionCodes[0],
                        'percentage': data.status === 'completed' ? 1.0 : data.userFraction,
                        'notes': data.releaseNotes
                    })
                })
                .catch((err) => rej(err))
        })
    },
    reply: function (reviewId, text) {
        return new Promise((res, rej) => {
            playstore.reply(reviewId, text, configuration.PLAY_STORE_APPLICATION_ID)
                .then(() => res())
                .catch((error) => rej(error))
        })
    },
    findReview: function (reviewId) {
        return repository.findReview(reviewId, PLATFORM)
    }
}
