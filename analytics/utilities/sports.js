const common = require('./common.js')

const SPORTS_COLUMNS = 3
const SPORTS_AMOUNT = 1

module.exports = {
    values: function (content, endQuery) {
        endQuery = endQuery === undefined ? 'Android Users' : endQuery

        const items = common.filter(content, {
            initialQuery: 'Sports users',
            endQuery: endQuery,
            amount: SPORTS_COLUMNS * SPORTS_AMOUNT
        })

        return common.map(items, (items, index) => {
            return {
                name: "Sports",
                views: items[index + 1].str.replace(/,/g, '.')
            }
        }, {
            amount: SPORTS_COLUMNS * SPORTS_AMOUNT,
            increment: SPORTS_COLUMNS
        })
    }
}
