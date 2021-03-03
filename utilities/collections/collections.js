module.exports = {
    shuffle: function (array) {
        let currentIndex = array.length, temporaryValue, randomIndex

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex -= 1

            temporaryValue = array[currentIndex]
            array[currentIndex] = array[randomIndex]
            array[randomIndex] = temporaryValue
        }

        return array
    },
    indexOfMax: function (array) {
        if (array.length === 0) {
            return -1;
        }

        let max = array[0]
        let maxIndex = 0

        for (let i = 1; i < array.length; i++) {
            if (array[i] > max) {
                maxIndex = i
                max = array[i]
            }
        }

        return maxIndex
    },
    chunk: function (arr, size) {
        return Array.from(
            {length: Math.ceil(arr.length / size)},
            (v, i) => arr.slice(i * size, i * size + size)
        )
    }
}
