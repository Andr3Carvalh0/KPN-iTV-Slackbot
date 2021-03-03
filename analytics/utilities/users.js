const common = require('./common.js')

const USERS_COLUMNS = 5
const USERS_AMOUNT = 3

module.exports = {
    values: function (content) {
        const items = common.filter(content, {
            initialQuery: 'Returning Visitor',
            endQuery: 'Returning Visitor',
            filter: (e) => e !== ' ',
            amount: USERS_COLUMNS * USERS_AMOUNT
        })

        return common.map(items, (items, index) => {
            return {
                name: items[index].str.replace(/,/g, '.').replace("Visitor", "users").trim(),
                amount: items[index + 1].str.replace(/,/g, '.')
            }
        }, {
            amount: USERS_COLUMNS * USERS_AMOUNT,
            increment: USERS_COLUMNS
        })
    }
}
