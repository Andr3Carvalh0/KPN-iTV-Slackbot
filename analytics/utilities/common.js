const LIMIT = 500

function defaultFilter() {
    return true
}

module.exports = {
    filter: function (content, options) {
        const filter = options.filter || defaultFilter
        const version = content.filter(v => v.str === options.initialQuery)[0] || []

        let tmp = content

        if (options.order === false) {
            tmp = tmp.filter(v => filter(v.str)).splice(0, LIMIT)
        } else {
            tmp = tmp.filter(v => v.y >= version.y).filter(v => filter(v.str)).splice(0, LIMIT)
        }

        const indexStart = tmp.findIndex(e => e.str === options.endQuery) + (options.offset || 0)

        const items = tmp.splice(indexStart, options.amount)

        if (items.length === options.amount) {
            return items
        } else {
            return undefined
        }
    },
    map: function (items, map, options) {
        if (items === undefined) return undefined

        const result = []

        for (let index = 0; index < options.amount; index = index + options.increment) {
            result.push(map(items, index))
        }

        return result
    }
}
