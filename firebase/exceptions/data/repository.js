const predefined = require('./local/exceptions.json')
const userdefined = require('./database.js')

module.exports = {
    issue: function (exception) {
        const i = userdefined.issue(exception)

        if (i !== undefined) {
            return i
        }

        const e = predefined.filter(e => e.file.includes(exception.file))

        return (e !== undefined && e.length > 0) ? e[0].cause : undefined
    },
    add: function (key, reason) {
        return new Promise((res) => {
            userdefined.add(key, reason)
            res()
        })
    }
}
