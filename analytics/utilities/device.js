const common = require('./common.js')

const DEVICE_COLUMNS = 2
const DEVICE_AMOUNT = 2
const BRAND_COLUMNS = 4
const BRAND_AMOUNT = 3
const BRAND_OFFSET = 6

module.exports = {
    type: function (content) {
        const items = common.filter(content, {
            initialQuery: 'Phone',
            endQuery: 'Phone',
            order: false,
            amount: DEVICE_AMOUNT * DEVICE_COLUMNS
        })

        if (items.length === DEVICE_COLUMNS * DEVICE_AMOUNT) {
            return [
                {
                    name: items[0].str,
                    percentage: items[3].str

                },
                {
                    name: items[1].str,
                    percentage: items[2].str

                }
            ].sort((value1, value2) => {
                const v1 = parseInt(value1.percentage.replace(/\./g, '').replace('%', ''), 10)
                const v2 = parseInt(value2.percentage.replace(/\./g, '').replace('%', ''), 10)

                return v2 - v1
            })
        }

        return undefined
    },
    manufacturers: function (content) {
        let items = common.filter(content, {
            initialQuery: 'Mobile Devi',
            endQuery: 'Mobile Devi',
            filter: (e) => e !== " ",
            offset: BRAND_OFFSET,
            amount: (2 * BRAND_AMOUNT) * BRAND_COLUMNS
        })

        if (items === undefined) return items

        items = items.filter(e => e.str.charCodeAt(0) !== 160).splice(0, BRAND_AMOUNT * BRAND_COLUMNS)

        return common.map(items, (items, index) => {
            return {
                name: items[index].str,
                amount: items[index + 2].str.replace(/,/g, '.'),
                percentage: items[index + 1].str
            }
        }, {
            amount: BRAND_AMOUNT * BRAND_COLUMNS,
            increment: BRAND_COLUMNS
        })

    }
}
