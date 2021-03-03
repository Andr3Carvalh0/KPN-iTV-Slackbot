module.exports = {
    average: function (items, count) {
        const total = items.reduce((a, b) => a + b, 0)

        return total / count
    },
    mode: function (items) {
        let index = 0

        for (let i = 0; i < items.length; i++) {
            if (items[i] > items[index]) {
                index = i
            }
        }

        return index
    }
}
