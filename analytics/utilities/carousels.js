const common = require('./common.js')

const NORMAL_CAROUSEL_AMOUNT = 3
const NORMAL_CAROUSEL_COLUMNS = 3
const NORMAL_CAROUSEL_OFFSET = 3

const MOODS_CAROUSEL_AMOUNT = 3
const MOODS_CAROUSEL_COLUMNS = 3
const MOODS_CAROUSEL_OFFSET = 3

module.exports = {
    normal: function (content) {
        const items = common.filter(content, {
            initialQuery: 'Populair Carousels',
            endQuery: 'Populair Carousels',
            offset: NORMAL_CAROUSEL_OFFSET,
            filter: (e) => e !== ' ',
            order: false,
            amount: NORMAL_CAROUSEL_AMOUNT * NORMAL_CAROUSEL_COLUMNS
        })

        if (items.length !== NORMAL_CAROUSEL_AMOUNT * NORMAL_CAROUSEL_COLUMNS || items[0].str !== "1.") {
            return undefined
        }

        return common.map(items, (items, index) => {
            return {
                name: items[index + 1].str,
                number: items[index + 2].str.replace(/,/g, '.')
            }
        }, {
            amount: NORMAL_CAROUSEL_AMOUNT * NORMAL_CAROUSEL_COLUMNS,
            increment: NORMAL_CAROUSEL_COLUMNS
        })
    },
    mood: function (content) {
        const items = common.filter(content, {
            initialQuery: 'Populair Moods',
            endQuery: 'Populair Moods',
            offset: MOODS_CAROUSEL_OFFSET,
            filter: (e) => e !== ' ',
            order: false,
            amount: MOODS_CAROUSEL_AMOUNT * MOODS_CAROUSEL_COLUMNS
        })

        if (items.length !== MOODS_CAROUSEL_AMOUNT * MOODS_CAROUSEL_COLUMNS || items[0].str !== "1.") {
            return undefined
        }

        return common.map(items, (items, index) => {
            return {
                name: items[index + 1].str.replace('Mood=', ''),
                number: items[index + 2].str.replace(/,/g, '.')
            }
        }, {
            amount: MOODS_CAROUSEL_AMOUNT * MOODS_CAROUSEL_COLUMNS,
            increment: MOODS_CAROUSEL_COLUMNS
        })
    }
}
