const common = require('./common.js')
const texts = require('./../../utilities/strings/text.js')

const DEVICE_COLUMNS = 2
const DEVICE_AMOUNT = 2
const BRAND_COLUMNS = 4
const BRAND_AMOUNT = 3
const BRAND_OFFSET = 6
const DEVICES_COLUMNS = 3
const DEVICES_AMOUNT = 10

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
                const v1 = texts.int(value1.percentage)
                const v2 = texts.int(value2.percentage)

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
    },
    devices: function (content) {
        let items = common.filter(content, {
            initialQuery: 'Brand',
            endQuery: 'Brand',
            filter: (e) => e !== " ",
            offset: DEVICES_COLUMNS,
            amount: DEVICES_AMOUNT * DEVICES_COLUMNS
        })

        if (items === undefined) return items

        items = items.filter(e => e.str.charCodeAt(0) !== 160).splice(0, DEVICES_AMOUNT * DEVICES_COLUMNS)

        return common.map(items, (items, index) => {
            return {
                name: `${items[index].str} ${items[index + 1].str}`,
                amount: items[index + 2].str.replace(/,/g, '.')
            }
        }, {
            amount: DEVICES_AMOUNT * DEVICES_COLUMNS,
            increment: DEVICES_COLUMNS
        })
    }
}
