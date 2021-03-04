const carousels = require('./../utilities/carousels.js')
const device = require('./../utilities/device.js')
const kids = require('./../utilities/kids.js')
const pdf = require('pdf.js-extract').PDFExtract
const player = require('./../utilities/player.js')
const recording = require('./../utilities/recordings.js')
const screens = require('./../utilities/screens.js')
const session = require('./../utilities/session.js')
const sports = require('./../utilities/sports.js')
const users = require('./../utilities/users.js')
const versions = require('./../utilities/versions.js')

module.exports = {
    android: function (path) {
        return new Promise((res, rej) => {
            new pdf().extract(path)
                .then(data => {
                    let iTVversions
                    let amountOfUsers
                    let platformVersions
                    let topScreens
                    let playback
                    let kidsValues
                    let sportsValues
                    let phoneVsTablet
                    let sessionDuration
                    let playout
                    let chromecast
                    let manufacturers
                    let recordingsValues
                    let popularMoods
                    let popularCarousels

                    data.pages.forEach(function (i) {
                        const content = i.content

                        try {
                            if (content.filter(v => v.str.includes('Android - ')).length > 0) {
                                iTVversions = versions.app(content) || iTVversions
                                amountOfUsers = users.values(content) || amountOfUsers
                                platformVersions = versions.platform(content) || platformVersions
                                topScreens = screens.values(content) || topScreens
                                playback = player.values(content) || playback
                                sessionDuration = session.values(content) || sessionDuration
                                playout = player.playout(content) || playout
                                chromecast = player.chromecastPlayout(content) || chromecast
                                manufacturers = device.manufacturers(content) || manufacturers
                                recordingsValues = recording.values(content) || recordingsValues
                                popularCarousels = carousels.normal(content) || popularCarousels
                                popularMoods = carousels.mood(content) || popularMoods
                            }

                            if (content.filter(v => v.str.includes('Android - Users')).length > 0) {
                                phoneVsTablet = device.type(content) || phoneVsTablet
                            }

                            if (content.filter(v => v.str.includes('Sports section')).length > 0) {
                                sportsValues = sports.values(content) || sportsValues
                            }

                            if (content.filter(v => v.str.includes('Kids zone')).length > 0) {
                                kidsValues = kids.values(content) || kidsValues
                            }
                        } catch (e) {
                            // Probably the generated PDF has a bug :(
                        }
                    })

                    res(
                        {
                            version: iTVversions,
                            users: amountOfUsers,
                            platform: platformVersions,
                            screens: topScreens,
                            player: playback,
                            sportsAndKids: [sportsValues, kidsValues].filter(e => e === undefined).length > 0
                                ? undefined
                                : sportsValues.concat(kidsValues),
                            devices: phoneVsTablet,
                            sessions: sessionDuration,
                            playout: playout,
                            chromecastPlayout: chromecast,
                            manufacturers: manufacturers,
                            recordings: recordingsValues,
                            moods: popularMoods,
                            carousels: popularCarousels
                        }
                    )

                })
                .catch(error => rej(error))
        })
    },
    ios: function (path) {
        return new Promise((res, rej) => {
            new pdf().extract(path)
                .then(data => {
                    let iTVversions
                    let amountOfUsers
                    let platformVersions
                    let playback
                    let kidsValues
                    let sportsValues
                    let sessionDuration
                    let popularMoods
                    let popularCarousels
                    let playout
                    let chromecast

                    data.pages.forEach(function (i) {
                        const content = i.content

                        try {
                            if (content.filter(v => v.str.includes('iOS - ')).length > 0) {
                                iTVversions = versions.app(content) || iTVversions
                                amountOfUsers = users.values(content) || amountOfUsers
                                platformVersions = versions.platform(content) || platformVersions
                                sessionDuration = session.values(content) || sessionDuration
                                playback = player.values(content) || playback
                                popularCarousels = carousels.normal(content) || popularCarousels
                                popularMoods = carousels.mood(content) || popularMoods
                                playout = player.playout(content) || playout
                                chromecast = player.chromecastPlayout(content) || chromecast
                            }

                            if (content.filter(v => v.str.includes('Sports section')).length > 0) {
                                sportsValues = sports.values(content, 'iOS Users') || sportsValues
                            }

                            if (content.filter(v => v.str.includes('Kids zone')).length > 0) {
                                kidsValues = kids.values(content, 'iOS') || kidsValues
                            }
                        } catch (e) {
                            // Probably the generated PDF has a bug :(
                        }
                    })

                    res(
                        {
                            version: iTVversions,
                            users: amountOfUsers,
                            platform: platformVersions,
                            sportsAndKids: [sportsValues, kidsValues].filter(e => e === undefined).length > 0
                                ? undefined
                                : sportsValues.concat(kidsValues),
                            sessions: sessionDuration,
                            player: playback,
                            moods: popularMoods,
                            carousels: popularCarousels,
                            playout: playout,
                            chromecastPlayout: chromecast
                        }
                    )
                })
                .catch(error => rej(error))
        })
    }
}
