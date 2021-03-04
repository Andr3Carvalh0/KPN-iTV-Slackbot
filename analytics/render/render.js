const arrayUtilities = require('./../../utilities/collections/collections.js')
const carousels = require('./../factories/usage/carousels.js')
const chromecastPlayout = require('./../factories/usage/chromecast_content_playout.js')
const header = require('./../factories/header.js')
const histogram = require('./../factories/general/histogram.js')
const itv = require('./../factories/general/iTV.js')
const manufacturers = require('./../factories/general/manufacturers.js')
const moods = require('./../factories/usage/moods.js')
const platform = require('./../factories/general/platform.js')
const playback = require('./../factories/usage/playback.js')
const playout = require('./../factories/usage/content_playout.js')
const rating = require('./../factories/general/rating.js')
const ratings = require('./../factories/general/ratings.js')
const session = require('./../factories/usage/session.js')
const sportsKids = require('./../factories/usage/sports&kids.js')
const users = require('./../factories/general/users.js')

const MAX_BLOCKS = 2
const PLATFORM_ANDROID = 0
const PLATFORM_IOS = 1

function pick(data, items, os) {
    const result = items.filter(i => i !== undefined).filter(i => i.isValid(data))

    return arrayUtilities.chunk(result, MAX_BLOCKS).map(e => {
        return {
            type: "section",
            fields: e.map(i => {
                return {
                    type: "mrkdwn",
                    text: i.title(data, os) + "\n" + i.message(data, os).replace('>', 'Over').replace('<', 'Under')
                }
            })
        }
    }).flatMap(
        (value, index, array) =>
            array.length - 1 !== index
                ? [value, {
                    type: "section",
                    text: {
                        type: "plain_text",
                        text: " "
                    }
                }] : value
    )
}

function renderData(data, modules, filters, os) {
    return pick(data, modules.filter(e => !filters.includes(e.id())), os)
}

module.exports = {
    analytics: function (data, options) {
        const filters = (options || {}).filters || []
        const os = (options || {}).platform || PLATFORM_ANDROID

        return {
            attachments: [{
                blocks: [header.get(os)]
                    .concat(renderData(data, [rating, histogram, ratings, users], filters, os))
                    .filter(e => e !== undefined)
            }]
        }
    },
    general: function (data, options) {
        const hasHeader = (options || {}).renderHeader || false
        const filters = (options || {}).filters || []
        const os = (options || {}).platform || PLATFORM_ANDROID

        return {
            attachments: [{
                blocks: [
                    hasHeader
                        ? header.get(os)
                        : {
                        type: "header",
                        text: {
                            type: "plain_text",
                            text: "General Information"
                        }
                    }
                ]
                    .concat(renderData(data, [platform, session, itv, manufacturers], filters, os))
                    .filter(e => e !== undefined)
            }]
        }
    },
    usage: function (data, options) {
        const hasHeader = (options || {}).renderHeader || false
        const filters = (options || {}).filters || []
        const os = (options || {}).platform || PLATFORM_ANDROID

        return {
            attachments: [{
                blocks: [
                    hasHeader
                        ? header.get(os)
                        : {
                        type: "header",
                        text: {
                            type: "plain_text",
                            text: "Usage Information"
                        }
                    }
                ]
                    .concat(renderData(data, [playback, carousels, moods, sportsKids], filters, os))
                    .filter(e => e !== undefined)
            }]
        }
    },
    playback: function (data, options) {
        const hasHeader = (options || {}).renderHeader || false
        const filters = (options || {}).filters || []
        const os = (options || {}).platform || PLATFORM_ANDROID

        return {
            attachments: [{
                blocks: [
                    hasHeader
                        ? header.get(os)
                        : {
                            type: "header",
                            text: {
                                type: "plain_text",
                                text: "Playback Breakdown"
                            }
                        }
                ]
                    .concat(renderData(data, [playout, chromecastPlayout], filters, os))
                    .filter(e => e !== undefined)
            }]
        }
    },
    separator: function () {
        return {
            attachments: [{
                blocks: [{
                    type: "section",
                    text: {
                        type: "plain_text",
                        text: " "
                    }
                }]
            }]
        }
    },
    ANDROID: PLATFORM_ANDROID,
    IOS: PLATFORM_IOS
}
