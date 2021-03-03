const giphy = require('./giphy.js')
const log = require('./../debug/logger.js')
const random = require('./../others/randomizer.js')
const sorting = require('./../collections/collections.js')

const router = new Map(
    [
        [0, 'https://i.imgur.com/jrDdIGT.png'],    // iTV Android logo
        [1, 'https://i.imgur.com/K0F67Sx.png'],    // Analytics
        [2, 'https://i.imgur.com/s1FO8Zi.png'],    // Firebase
        [3, 'https://i.imgur.com/Uulh8zB.png'],    // Unit Tests
        [4, 'https://i.imgur.com/uDO3ENa.png'],    // Android TV
        [5, 'https://i.imgur.com/TXDRfpe.png'],    // Release
        [6, 'https://i.imgur.com/H7wXAyw.png'],    // Reviews
        [7, 'https://i.imgur.com/XfhVCSU.png'],    // Lint
        [8, 'https://i.imgur.com/jE2FScy.png'],    // App Store
        [9, 'https://i.imgur.com/RqVsZCf.png'],    // iOS Analytics
        [1509, 'https://i.imgur.com/utdxynz.png'], // Player
        [1510, 'https://i.imgur.com/MMSScXY.png'], // Fonts
        [1511, 'https://i.imgur.com/PTVi4S7.png'], // Icons
        [1512, 'https://i.imgur.com/fTxE2YP.png'], // Views
        [1513, 'https://i.imgur.com/bWa1RFh.png'], // MQTT
        [1514, 'https://i.imgur.com/lywMUZP.png'], // Network
        [1515, 'https://i.imgur.com/JETWpsx.png'], // Halo
        [1675, 'https://i.imgur.com/5qu9lF1.png'], // Katalon

        // Special cases
        [-998, 'https://i.imgur.com/CA7yGT9.png'], // Blank image
        [-999, 'https://i.imgur.com/EVgEK0l.png']  // Frits image
    ]
)

const GIPHY_URL = 'https://media.giphy.com/media/${placeholder}/giphy.gif'
const GIPHY_PLACEHOLDER = '${placeholder}'

const HAPPY = {
    tags: [
        'happy',
        'joy',
        'delight',
        'happiness',
        'thumbs up',
        'cool',
        'victory',
        'dancing',
        'woo hoo',
        'high five',
        'congratulations',
        'thank you',
        'celebration',
        'ok'
    ],
    fallback: [
        'https://media.giphy.com/media/l3V0doGbp2EDaLHJC/giphy.gif',
        'https://media.giphy.com/media/6J2kRTRUht18A/giphy.gif',
        'https://media.giphy.com/media/APPbIpIe0xrVe/giphy.gif',
        'https://media.giphy.com/media/ZdFxoPhIS4glG/giphy.gif',
        'https://media.giphy.com/media/ZFTKZ8zwj38gE/giphy.gif',
        'https://media.giphy.com/media/psuNQ0XMaYe1a/giphy.gif',
        'https://media.giphy.com/media/13B3a2WWKcEo9O/giphy.gif'
    ]
}

const SAD = {
    tags: [
        'sad',
        'sadness',
        'cry',
        'weep',
        'weeping',
        'thumbs down',
        'yuck',
        'mad',
        'scared',
        'confused',
        'disappointed',
        'why'
    ],
    fallback: [
        'https://media.giphy.com/media/ZI88V08ZzgMWA/giphy.gif',
        'https://media.giphy.com/media/zMCfqXkwjmTO8/giphy.gif',
        'https://media.giphy.com/media/ut5BnSwU2fpks/giphy.gif',
        'https://media.giphy.com/media/kBlhNVdIbCIK3oKBWk/giphy.gif',
        'https://media.giphy.com/media/KrPzrcHuTPvUs/giphy.gif',
        'https://media.giphy.com/media/2UCt7zbmsLoCXybx6t/giphy.gif'
    ]
}

const SURPRISE = {
    tags: [
        'shocked',
        'omg',
        'oh my god',
        'wow'
    ],
    fallback: [
        'https://media.giphy.com/media/3o72F8t9TDi2xVnxOE/giphy.gif',
        'https://media.giphy.com/media/VHqeGf8VPyxINZVQP1/giphy.gif',
        'https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif',
        'https://media.giphy.com/media/TIRlx3Fzi1A7L2d5z7/giphy.gif',
        'https://media.giphy.com/media/vQqeT3AYg8S5O/giphy.gif'
    ]
}

const BROKEN = {
    tags: [],
    fallback: [
        'https://media.giphy.com/media/O3GqAYR9jFxLi/giphy.gif',
        'https://media.giphy.com/media/3orieMQGRwRZq1tL2w/giphy.gif'
    ]
}

const TAG = 'images.js'
const MIN_BOUND = 0
const MAX_BOUND = 10
const THRESHOLD = 2

function image(collection) {
    return new Promise((res) => {
        if ((random.generate(MIN_BOUND, MAX_BOUND) <= THRESHOLD) || collection.tags.length === 0) {
            log.i(TAG, 'Using local Giphy links.')
            res(sorting.shuffle(collection.fallback)[0])
        } else {
            giphy.random(sorting.shuffle(collection.tags)[0])
                .then((data) => {
                    log.d(TAG, `Giphy response: ${JSON.stringify(data)}`)
                    res(GIPHY_URL.replace(GIPHY_PLACEHOLDER, data.id))
                })
                .catch((err) => {
                    log.e(TAG, err)
                    res(sorting.shuffle(collection.fallback)[0])
                })
        }
    })
}

module.exports = {
    route: function (id) {
        if (router.has(id)) {
            return router.get(id)
        }

        return router.get(0)
    },
    analytics: function () {
        return router.get(1)
    },
    firebase: function () {
        return router.get(2)
    },
    unitTests: function () {
        return router.get(3)
    },
    androidTV: function () {
        return router.get(4)
    },
    release: function () {
        return router.get(5)
    },
    reviews: function () {
        return router.get(6)
    },
    lint: function () {
        return router.get(7)
    },
    blank: function () {
        return router.get(-998)
    },
    happy: function () {
        return image(HAPPY)
    },
    sad: function () {
        return image(SAD)
    },
    surprise: function () {
        return image(SURPRISE)
    },
    broken: function () {
        return image(BROKEN)
    },
    notApproved: function () {
        return "https://media.giphy.com/media/Gl1AS8Ix4ZtnOKeaUO/giphy.gif"
    },
    appstore: function () {
        return router.get(8)
    },
    iOSAnalytics: function () {
        return router.get(9)
    }
}
