const common = require('./common.js')

const KIDS_COLUMNS = 3
const KIDS_AMOUNT = 1
const KIDS_OFFSET = 1

module.exports = {
    values: function (content, endQuery) {
        endQuery = endQuery === undefined ? 'Android' : endQuery

        const items = common.filter(content, {
            initialQuery: 'Users per platform',
            endQuery: endQuery,
            offset: KIDS_OFFSET,
            amount: KIDS_COLUMNS * KIDS_AMOUNT
        })

        return common.map(items, (items, index) => {
            return {
                name: "Kids",
                views: items[index].str.replace(/,/g, '.')
            }
        }, {
            amount: KIDS_COLUMNS * KIDS_AMOUNT,
            increment: KIDS_COLUMNS
        })
    }
}
