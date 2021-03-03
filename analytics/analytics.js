const androidRepository = require('./../play_store/data/repository.js')
const bigQuery = require('./../big_query/big_query.js')
const configuration = require('./../configuration/configurations.js')
const database = require('./../schedule/modules/data/database.js')
const iOSRepository = require('./../app_store/data/repository.js')
const log = require('./../utilities/debug/logger.js')
const render = require('./render/render.js')
const utilities = require('./data/pdfs.js')

const TAG = 'analytics.js'
const OFFSET = 0.150

const ANDROID = database.ANDROID
const IOS = database.IOS

function crashRate(events, total) {
    return ((1 - (events / total)) * 100).toFixed(2)
}

function fetchBigQuery(version, amountOfUsers) {
    return new Promise((res, rej) => {
        if (configuration.DISABLE_BIG_QUERY) {
            rej('Big Query is disabled!')
        } else {
            bigQuery.crashes(version)
                .then((data) => {
                    if (amountOfUsers !== undefined) {
                        res({
                            percentage: crashRate(data, (amountOfUsers + amountOfUsers * OFFSET)),
                            lastWeekPercentage: database.crashes(ANDROID)
                        })
                    } else {
                        rej('Invalid number of users!')
                    }
                })
                .catch((error) => rej(error))
        }
    })
}

function fetchStoreInformation(version, platform) {
    return new Promise((res, rej) => {
        const repository = platform === ANDROID ? androidRepository : iOSRepository

        Promise.allSettled([
            repository.rating({local: true}),
            repository.histogramForRelease(version),
            repository.mostRecentReleasesRating({version: version})
        ])
            .then((data) => {
                res({
                    rating: {
                        value: data[0].value.current.value,
                        detail: data[0].value.current.detailed,
                        lastWeek: database.rating(platform)
                    },
                    histogram: data[1].value,
                    release: data[2].value
                })
            })
            .catch((error) => rej(error))
    })
}

function process(user, data, os) {
    const analytics = render.analytics(data, {
        platform: os,
        filters: user.analytics || []
    })
    const hasAnalytics = analytics.attachments[0].blocks.length > 2

    const general = render.general(data, {
        platform: os,
        filters: user.general || [],
        renderHeader: !hasAnalytics
    })
    const hasGeneral = general.attachments[0].blocks.length > 2

    const usage = render.usage(data, {
        platform: os,
        filters: user.usage || [],
        renderHeader: !hasAnalytics && !hasGeneral
    })
    const hasUsage = usage.attachments[0].blocks.length > 2

    const playback = render.playback(data, {
        platform: os,
        filters: user.playback || [],
        renderHeader: !hasAnalytics && !hasGeneral && !hasUsage
    })
    const hasPlayback = playback.attachments[0].blocks.length > 1

    return {
        id: user.id,
        view: {
            attachments: [
                hasAnalytics ? analytics : undefined,
                hasGeneral ? general : undefined,
                hasUsage ? usage : undefined,
                hasPlayback ? playback : undefined
            ]
                .filter(e => e !== undefined)
                .map(i => i.attachments).flat(1)
        }
    }
}

module.exports = {
    android: function (path, options) {
        return new Promise((res, rej) => {
            utilities.android(path)
                .then(data => {
                    log.d(TAG, 'Android Extracted information from pdf')

                    const version = androidRepository.version()
                    data['released'] = version

                    Promise.allSettled([
                        fetchBigQuery(version, data.users.length === 0 ? undefined : parseInt(data.users[2].amount.replace(".", ""), 10)),
                        fetchStoreInformation(version, ANDROID)
                    ])
                        .then((result) => {
                            if (result[0].status === "fulfilled") {
                                data['crashes'] = result[0].value

                                database.updateCrashesValue(result[0].value.percentage, ANDROID)
                            }

                            if (result[1].status === "fulfilled") {
                                data['rating'] = result[1].value.rating
                                data['histogram'] = result[1].value.histogram
                                data['ratingsPerVersion'] = result[1].value.release

                                database.updateRatingValue(result[1].value.rating.detail, ANDROID)
                            }

                            res(options.map(e => process(e, data, ANDROID)))
                        })
                        .catch((error) => rej(error))
                })
                .catch(err => rej(err))
        })
    },
    ios: function (path, options) {
        return new Promise((res, rej) => {
            utilities.ios(path)
                .then(data => {
                    log.d(TAG, 'iOS Extracted information from pdf')

                    const version = iOSRepository.version()
                    data['released'] = version

                    fetchStoreInformation(version, IOS)
                        .then((result) => {
                            data['rating'] = result.rating
                            data['histogram'] = result.histogram
                            data['ratingsPerVersion'] = result.release

                            database.updateRatingValue(result.rating.detail, IOS)

                            res(options.map(e => process(e, data, IOS)))
                        })
                        .catch((error) => rej(error))

                })
                .catch(err => rej(err))
        })
    }
}
