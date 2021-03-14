const common = require('./common.js')
const texts = require('./../../utilities/strings/text.js')

const SESSION_AMOUNT = 7
const LIMIT = 20
const TOTAL_AMOUNT = 1
const TOTAL_OFFSET = 1

// Tried a regex expression didn't work cause the space is a bit weird
const BLACKLIST = ['1. ', '2. ', '3. ', '4. ', '5. ', '6. ', '7. ']

module.exports = {
    values: function (content) {
        let items = common.filter(content, {
            initialQuery: '< 10 sec',
            endQuery: '< 10 sec',
            order: false,
            amount: LIMIT
        })

        if (items !== undefined) {
            items = items.filter(e => !BLACKLIST.includes(e.str))
        }

        const transformed = common.map(items, (items, index) => {
            return {
                name: items[index].str.replace('sec', 'secs').replace('min', 'mins'),
                percentage: items[index + SESSION_AMOUNT].str,
            }
        }, {
            amount: SESSION_AMOUNT,
            increment: 1
        })

        if (transformed === undefined) return transformed

        return transformed.sort((value1, value2) => {
            const v1Mult = (value1.percentage.indexOf('.') === 2 && value1.percentage.length <= 5) ? 10 : 1
            const v2Mult = (value2.percentage.indexOf('.') === 2 && value2.percentage.length <= 5) ? 10 : 1

            const v1 = texts.int(value1.percentage)
            const v2 = texts.int(value2.percentage)

            return (v2 * v2Mult) - (v1 * v1Mult)
        })
    },
    total: function (content) {
        let items = common.filter(content, {
            initialQuery: 'Android Session Duration',
            endQuery: 'Android Session Duration',
            order: false,
            amount: TOTAL_AMOUNT,
            offset: TOTAL_OFFSET
        })

        return common.map(items, (items, index) => {
            const tmp = items[index].str.split(":")
            const seconds = (tmp[0] * 60 * 60) + (tmp[1] * 60) + (tmp[2])

            const days = Math.floor(parseInt(tmp[0]) / 24)
            const hours = parseInt(tmp[0]) % 24

            return {
                "total": `${days} days ${hours} hours`,
                "seconds": seconds
            }
        }, {
            amount: TOTAL_AMOUNT,
            increment: TOTAL_AMOUNT
        })
    }
}
