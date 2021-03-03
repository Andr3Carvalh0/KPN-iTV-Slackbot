function render(item) {
    return item === undefined ? undefined : `*${item.name}* *${item.name === 1 ? "star" : "stars"}* - ${item.value}`
}

module.exports = {
    id: function () {
        return "histogram"
    },
    title: function (data) {
        return `:star2: *${data.histogram.version} Rating Breakdown:*`
    },
    message: function (data) {
        const items = data.histogram.data.map((e, index) => {
            return {
                name: index + 1,
                value: e
            }
        }).reverse()

        let result = ""

        for (let index = 0; index < items.length; index = index + 2) {
            const o1 = render(items[index])
            const o2 = render(index + 1 > items.length ? undefined : items[index + 1])

            result += `\n${o1}${o2 === undefined ? "" : "\t\t\t" + o2}`
        }

        return result.trim()
    },
    isValid: function (data) {
        return data !== undefined && data.histogram !== undefined
    }
}
