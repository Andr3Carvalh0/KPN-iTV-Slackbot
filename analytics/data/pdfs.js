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

const APP_VERSION = 'app_version'
const AMOUNT_USERS = 'amount_users'
const OS_VERSION = 'os_version'
const SCREENS = 'screens'
const PLAYBACK = 'playback'
const KIDS = 'kids'
const SPORTS = 'sports'
const DEVICE_TYPE = 'device_type'
const SESSION_DURATION = 'session_duration'
const DEVICE_PLAYBACK = 'device_playback'
const CHROMECAST_PLAYBACK = 'chromecast_playback'
const MANUFACTURERS = 'manufacturers'
const DEVICES = 'devices'
const RECORDINGS = 'recordings'
const MOODS = 'moods'
const CAROUSELS = 'carousels'

function parse(path) {
    return new pdf().extract(path)
}

function process(path, predicates) {
    return new Promise((res, rej) => {
        parse(path)
            .then((data) => {
                const results = data.pages
                    .map(e => e.content)
                    .map(e => {
                        const predicate = predicates.filter(i => e.filter(v => v.str.includes(i.keyword)).length !== 0)

                        return {
                            keyword: predicate.length > 0 ? predicate[0].keyword : undefined,
                            operation: predicate.length > 0 ? predicate[0].operation : undefined,
                            content: e
                        }
                    })
                    .filter(e => e.keyword !== undefined)
                    .map(e => {
                        const results = new Map()

                        try {
                            e.operation.forEach(t => results.set(t.id, t.transform(e.content)))
                        } catch (e) {
                            // There is something wrong in the pdf, probably
                        }

                        return results
                    })
                    .reduce((previous, value) => {
                        value.forEach((value, key) => previous.set(key, value))

                        return previous
                    }, new Map())

                res({
                    version: results.get(APP_VERSION),
                    users: results.get(AMOUNT_USERS),
                    platform: results.get(OS_VERSION),
                    screens: results.get(SCREENS),
                    player: results.get(PLAYBACK),
                    sportsAndKids: [results.get(SPORTS), results.get(KIDS)].flat(1),
                    devices: results.get(DEVICE_TYPE),
                    sessions: results.get(SESSION_DURATION),
                    devicePlayback: results.get(DEVICE_PLAYBACK),
                    chromecastPlayback: results.get(CHROMECAST_PLAYBACK),
                    devicesBrands: results.get(DEVICES),
                    manufacturers: results.get(MANUFACTURERS),
                    recordings: results.get(RECORDINGS),
                    moods: results.get(MOODS),
                    carousels: results.get(CAROUSELS)
                })
            })
            .catch((error) => rej(error))
    })
}

module.exports = {
    android: function (path) {
        return process(path, [
            {
                keyword: 'Kids zone',
                operation: [
                    {
                        id: KIDS,
                        transform: (content) => kids.values(content)
                    }
                ]
            },
            {
                keyword: 'Sports section',
                operation: [
                    {
                        id: SPORTS,
                        transform: (content) => sports.values(content)
                    }
                ]
            },
            {
                keyword: 'Android - Users',
                operation: [
                    {
                        id: DEVICE_TYPE,
                        transform: (content) => device.type(content)
                    },
                    {
                        id: APP_VERSION,
                        transform: (content) => versions.app(content)
                    },
                    {
                        id: OS_VERSION,
                        transform: (content) => versions.platform(content)
                    },
                    {
                        id: DEVICES,
                        transform: (content) => device.devices(content)
                    }
                ]
            },
            {
                keyword: 'Android - Overview',
                operation: [
                    {
                        id: SESSION_DURATION,
                        transform: (content) => session.values(content)
                    },
                    {
                        id: AMOUNT_USERS,
                        transform: (content) => users.values(content)
                    },
                    {
                        id: SCREENS,
                        transform: (content) => screens.values(content)
                    },
                    {
                        id: RECORDINGS,
                        transform: (content) => recording.values(content)
                    },
                    {
                        id: PLAYBACK,
                        transform: (content) => player.values(content)
                    },
                    {
                        id: CAROUSELS,
                        transform: (content) => carousels.normal(content)
                    },
                    {
                        id: MOODS,
                        transform: (content) => carousels.mood(content)
                    }
                ]
            },
            {
                keyword: 'Android - Player',
                operation: [
                    {
                        id: DEVICE_PLAYBACK,
                        transform: (content) => player.playout(content)
                    },
                    {
                        id: CHROMECAST_PLAYBACK,
                        transform: (content) => player.chromecastPlayout(content)
                    }
                ]
            }
        ])
    },
    ios: function (path) {
        return process(path, [
            {
                keyword: 'Kids zone',
                operation: [
                    {
                        id: KIDS,
                        transform: (content) => kids.values(content, 'iOS')
                    }
                ]
            },
            {
                keyword: 'Sports section',
                operation: [
                    {
                        id: SPORTS,
                        transform: (content) => sports.values(content, 'iOS Users')
                    }
                ]
            },
            {
                keyword: 'iOS - Users',
                operation: [
                    {
                        id: APP_VERSION,
                        transform: (content) => versions.app(content)
                    },
                    {
                        id: AMOUNT_USERS,
                        transform: (content) => users.values(content)
                    },
                    {
                        id: SESSION_DURATION,
                        transform: (content) => session.values(content)
                    },
                    {
                        id: SCREENS,
                        transform: (content) => screens.values(content)
                    },
                    {
                        id: OS_VERSION,
                        transform: (content) => versions.platform(content)
                    }
                ]
            },
            {
                keyword: 'iOS - Features',
                operation: [
                    {
                        id: DEVICE_PLAYBACK,
                        transform: (content) => player.playout(content)
                    },
                    {
                        id: CHROMECAST_PLAYBACK,
                        transform: (content) => player.chromecastPlayout(content)
                    },
                    {
                        id: CAROUSELS,
                        transform: (content) => carousels.normal(content)
                    },
                    {
                        id: MOODS,
                        transform: (content) => carousels.mood(content)
                    },
                    {
                        id: PLAYBACK,
                        transform: (content) => player.values(content)
                    }
                ]
            }
        ])
    }
}
