const fuse = require('fuse.js')
const levenshtein = require('js-levenshtein')

module.exports = {
    levenshtein: function (input, collection, mapper) {
        let picked = {
            "index": -1,
            "delta": -1,
            "word": ""
        }

        collection.forEach((e, i) => {
            mapper(e).forEach((s) => {
                const delta = levenshtein(s, input)

                if (picked.delta === -1 || picked.delta > delta) {
                    picked.index = i
                    picked.delta = delta
                    picked.word = s
                }
            })
        })

        return picked
    },
    fuzzy: function (input, collection) {
        const search = new fuse(collection, {
            includeScore: true,
            ignoreLocation: true,
            keys: ['changelog']
        })

        return search.search(`'${input} | =${input}`)
    }
}
