const stringUtilities = require('./text.js')

const KEYWORD_REGEX = /@\w+/g

module.exports = {
    handle: function (text) {
        return stringUtilities.replace(text, KEYWORD_REGEX, (t) => "`" + t + "`")
    }
}
