module.exports = {
    generate: function (lowerBound, upperBound, options) {
        const isInclusive = options === undefined ? false : options.isInclusive

        return Math.floor(Math.random() * (upperBound - lowerBound + (isInclusive ? 1 : 0)) + lowerBound)
    }
}
