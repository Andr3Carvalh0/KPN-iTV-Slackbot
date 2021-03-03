const common = require('./common.js')

const PLAYBACK_COLUMNS = 3
const PLAYBACK_AMOUNT = 6
const PLAYBACK_OFFSET = 1
const PLAYBACK_INCREMENT_OFFSET = 2
const PLAYOUT_COLUMNS = 4
const PLAYOUT_AMOUNT = 3
const PLAYOUT_OFFSET = 2

const CONTENT_TYPES = 4

function isNumber(value) {
    if (typeof value != "string") return false
    value = value.replace(/,/g, '')

    return !isNaN(value) && !isNaN(parseFloat(value))
}

function processType(items) {
    const names = items.slice(0, CONTENT_TYPES).map(
        e => e.str.replace("Type=", "")
            .replace("LiveTV", "Live TV")
            .replace("CatchUp", "Catchup")
            .replace("Recording", "Recordings")
    )

    let index = items.length - 1

    while (!isNumber(items[index].str)) { index-- }

    const values = items.slice(index - CONTENT_TYPES + 1 , index + 1)

    if (values.filter(e => !isNumber(e.str)).length > 0) {
        return undefined
    } else {
        return values.map((e, i) => {
            return {
                name: names[i],
                amount: e.str.replace(/,/g, '.')
            }
        })
    }
}

module.exports = {
    values: function (content) {
        const items = common.filter(content, {
            initialQuery: 'Start Chromecast',
            endQuery: 'Stop Chromecast',
            filter: (e) => e !== ' ',
            amount: PLAYBACK_AMOUNT * PLAYBACK_COLUMNS
        })

        let result = common.map(items, (items, index) => {
            return {
                name: items[index].str.replace("Stop ", ""),
                start: items[index + PLAYBACK_COLUMNS + PLAYBACK_OFFSET].str.replace(/,/g, '.'),
                stop: items[index + PLAYBACK_OFFSET].str.replace(/,/g, '.')
            }
        }, {
            amount: PLAYBACK_AMOUNT * PLAYBACK_COLUMNS,
            increment: PLAYBACK_COLUMNS * PLAYBACK_INCREMENT_OFFSET
        })

        if (result === undefined) return result

        return result.map(
            (v) => {
                return {
                    name: v.name.replace("Playback", "Device"),
                    start: v.start,
                    stop: v.stop
                }
            }).sort((value1, value2) => parseInt(value2.start.replace(/\./g, ''), 10) - parseInt(value1.start.replace(/\./g, ''), 10))
    },
    playout: function (content) {
        const items = common.filter(content, {
            initialQuery: 'Chromecast content type playout',
            endQuery: 'Chromecast content type playout',
            filter: (e) => e !== ' ',
            order: false,
            offset: PLAYOUT_OFFSET,
            amount: PLAYOUT_AMOUNT * PLAYOUT_COLUMNS + 1
        })

        if (items === undefined || items.length > 0 && items[0].str !== "Type=LiveTV") {
            return undefined
        }

        return processType(items)
    },
    chromecastPlayout: function (content) {
        const items = common.filter(content, {
            initialQuery: 'Content type playout',
            endQuery: 'Content type playout',
            filter: (e) => e !== ' ',
            order: false,
            offset: PLAYOUT_OFFSET,
            amount: PLAYOUT_AMOUNT * PLAYOUT_COLUMNS + 1
        })

        if (items === undefined || items.length > 0 && items[0].str !== "Type=LiveTV") {
            return undefined
        }

        return processType(items)
    }
}
