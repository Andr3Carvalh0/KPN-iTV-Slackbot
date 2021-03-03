const common = require('./common.js')

const RECORDINGS_COLUMNS = 2
const RECORDINGS_AMOUNT = 6
const RECORDINGS_OFFSET = 5

module.exports = {
    values: function (content) {
        const items = common.filter(content, {
            initialQuery: 'Use of More menu',
            endQuery: 'Use of More menu',
            filter: (e) => e !== ' ',
            offset: RECORDINGS_OFFSET,
            amount: RECORDINGS_AMOUNT * RECORDINGS_COLUMNS
        })

        return common.map(items, (items, index) => {
            return {
                name: items[index].str.replace('Option=', '').replace(/([A-Z])/g, ' $1').trim(),
                amount: items[index + 1].str.replace(/,/g, '.')
            }
        }, {
            amount: RECORDINGS_AMOUNT * RECORDINGS_COLUMNS,
            increment: RECORDINGS_COLUMNS
        })
    }
}
