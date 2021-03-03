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
            new pdf().extract(path, {})
                .then(data => {
                    let iTVversions = []
                    let amountOfUsers = []
                    let platformVersions = []
                    let topScreens = []
                    let playback = []
                    let kidsValues = []
                    let sportsValues = []
                    let phoneVsTablet = []
                    let sessionDuration = []
                    let playout = []
                    let chromecast = []
                    let manufacturers = []
                    let recordingsValues = []
                    let secondsUsed = []
                    let popularMoods = []
                    let popularCarousels = []

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
                                sportsValues = sports.values(content) || sports
                            }

                            if (content.filter(v => v.str.includes('Kids zone')).length > 0) {
                                kidsValues = kids.values(content) || kids
                            }

                            if (content.filter(v => v.str.includes('General')).length > 0) {
                                if (secondsUsed.length === 0) {
                                    secondsUsed.push(session.total(content))
                                }
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
                            sportsAndKids: [sportsValues[0], kidsValues[0]],
                            devices: phoneVsTablet,
                            sessions: sessionDuration,
                            playout: playout,
                            chromecastPlayout: chromecast,
                            manufacturers: manufacturers,
                            recordings: recordingsValues,
                            moods: popularMoods,
                            carousels: popularCarousels,
                            total: (secondsUsed.length > 0) ? secondsUsed[0] : undefined
                        }
                    )

                })
                .catch(error => {
                    rej(error)
                })
        })
    },
    ios: function (path) {
        return new Promise((res, rej) => {
            new pdf().extract(path, {})
                .then(data => {
                    let iTVversions = []
                    let amountOfUsers = []
                    let platformVersions = []
                    let playback = []
                    let kidsValues = []
                    let sportsValues = []
                    let sessionDuration = []
                    let popularMoods = []
                    let popularCarousels = []

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
                            }

                            if (content.filter(v => v.str.includes('Sports section')).length > 0) {
                                sportsValues = sports.values(content, 'iOS Users') || sports
                            }

                            if (content.filter(v => v.str.includes('Kids zone')).length > 0) {
                                kidsValues = kids.values(content, 'iOS') || kids
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
                            sportsAndKids: [sportsValues[0], kidsValues[0]],
                            sessions: sessionDuration,
                            player: playback,
                            moods: popularMoods,
                            carousels: popularCarousels
                        }
                    )
                })
                .catch(error => {
                    rej(error)
                })
        })
    }
}
