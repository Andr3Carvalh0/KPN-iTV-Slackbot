const common = require('./common.js')

const MOST_USED_SCREEN_COLUMNS = 5
const MOST_USED_SCREEN_AMOUNT = 3
const MOST_USED_SCREEN_OFFSET = 6

module.exports = {
    values: function (content) {
        const items = common.filter(content, {
            initialQuery: 'Screen Name',
            endQuery: 'Screen Name',
            offset: MOST_USED_SCREEN_OFFSET,
            filter: (e) => e !== ' ',
            amount: MOST_USED_SCREEN_AMOUNT * MOST_USED_SCREEN_COLUMNS
        })

        return common.map(items, (items, index) => {
            return {
                name: items[index + 1].str.replace('Pro\u0000le', 'Profile'),
                views: items[index + 2].str.replace(/,/g, '.')
            }
        }, {
            amount: MOST_USED_SCREEN_AMOUNT * MOST_USED_SCREEN_COLUMNS,
            increment: MOST_USED_SCREEN_COLUMNS
        })
    }
}
