const common = require('./common.js')

const PLAYBACK_COLUMNS = 3
const PLAYBACK_AMOUNT = 6
const PLAYBACK_OFFSET = 1
const PLAYBACK_INCREMENT_OFFSET = 2
const PLAYOUT_COLUMNS = 4
const PLAYOUT_AMOUNT = 3
const PLAYOUT_OFFSET = 2
const PLAYOUT_AMOUNT_OFFSET = 2

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
        }).filter((e, i) => i !== PLAYOUT_COLUMNS)

        return common.map(items, (items, index) => {
            return {
                name: items[index].str.replace("Type=", "")
                    .replace("LiveTV", "Live TV")
                    .replace("CatchUp", "Catchup")
                    .replace("Recording", "Recordings"),
                amount: items[index + PLAYOUT_COLUMNS * PLAYOUT_AMOUNT_OFFSET].str.replace(/,/g, '.')
            }
        }, {
            amount: PLAYOUT_COLUMNS,
            increment: 1
        })
    },
    chromecastPlayout: function (content) {
        const items = common.filter(content, {
            initialQuery: 'Content type playout',
            endQuery: 'Content type playout',
            filter: (e) => e !== ' ',
            order: false,
            offset: PLAYOUT_OFFSET,
            amount: PLAYOUT_AMOUNT * PLAYOUT_COLUMNS
        })

        return common.map(items, (items, index) => {
            return {
                name: items[index].str.replace("Type=", "")
                    .replace("LiveTV", "Live TV")
                    .replace("CatchUp", "Catchup")
                    .replace("Recording", "Recordings"),
                amount: items[index + PLAYOUT_COLUMNS * PLAYOUT_AMOUNT_OFFSET].str.replace(/,/g, '.')
            }
        }, {
            amount: PLAYOUT_COLUMNS,
            increment: 1
        })
    }
}
