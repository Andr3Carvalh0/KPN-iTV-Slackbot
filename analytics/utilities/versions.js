const common = require('./common.js')

const MOST_USED_VERSION_COLUMNS = 4
const MOST_USED_VERSION_AMOUNT = 3
const MOST_USED_VERSION_OFFSET = 5

module.exports = {
    app: function (content) {
        const items = common.filter(content, {
            initialQuery: 'App Version',
            endQuery: 'App Version',
            offset: MOST_USED_VERSION_OFFSET,
            filter: (e) => e !== ' ',
            amount: MOST_USED_VERSION_AMOUNT * MOST_USED_VERSION_COLUMNS
        })

        return common.map(items, (items, index) => {
            return {
                name: items[index].str,
                percentage: items[index + 1].str,
                number: items[index + 2].str.replace(/,/g, '.')
            }
        }, {
            amount: MOST_USED_VERSION_AMOUNT * MOST_USED_VERSION_COLUMNS,
            increment: MOST_USED_VERSION_COLUMNS
        })
    },
    platform: function (content) {
        const items = common.filter(content, {
            initialQuery: 'OS version',
            endQuery: 'OS version',
            offset: MOST_USED_VERSION_OFFSET,
            filter: (e) => e !== ' ',
            amount: MOST_USED_VERSION_AMOUNT * MOST_USED_VERSION_COLUMNS
        })

        return common.map(items, (items, index) => {
            return {
                name: items[index].str,
                percentage: items[index + 1].str,
                number: items[index + 2].str.replace(/,/g, '.')
            }
        }, {
            amount: MOST_USED_VERSION_AMOUNT * MOST_USED_VERSION_COLUMNS,
            increment: MOST_USED_VERSION_COLUMNS
        })
    }
}
