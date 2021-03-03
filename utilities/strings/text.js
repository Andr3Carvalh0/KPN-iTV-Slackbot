module.exports = {
    trim: function (text, length, ellipse) {
        return text.length > length ? text.substring(0, length) + (ellipse || "...") : text
    },
    capitalize: function (text) {
        return text.charAt(0).toUpperCase() + text.slice(1)
    },
    capitalizeOnSpace: function (text) {
        return text.toLowerCase().split(' ')
            .map(e => {
                return this.capitalize(e)
            }).join(' ')
    },
    replace: function (text, regex, transformation) {
        const issues = text.matchAll(typeof regex === "string" ? new RegExp(`\\${regex}`) : regex)

        let transformed = ""
        let previous = 0

        Array.from(issues).forEach(v => {
            transformed += text.substring(previous, v['index'])
            transformed += (text.substring(v['index'] - 1, v['index']) === "`") ? v[0] : typeof transformation === "string" ? transformation : transformation(v[0])

            previous = v['index'] + v[0].length
        })

        if (previous !== text.length) {
            transformed += text.substring(previous)
        }

        return transformed
    }
}
