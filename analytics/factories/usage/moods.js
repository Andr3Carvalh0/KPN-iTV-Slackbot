const collections = require('./../../../utilities/collections/collections.js')
const common = require('./../common.js')

const emojis = [
    ":kpn::snowflake:",
    ":wine_glass::kissing_heart:",
    ":saxophone::sunrise:",
    ":no_good::jeans:",
    ":microphone::musical_note:"
]

function mood() {
    return collections.shuffle(emojis)[0]
}

module.exports = {
    id: function () {
        return "moods"
    },
    title: function () {
        return `${mood()} *Popular Moods:*`
    },
    message: function (data) {
        return common.output(data.moods, {
            name: ((e) => e.name),
            value: ((e) => e.number)
        }, {
            suffix: "clicks"
        })
    },
    isValid: function (data) {
        return data !== undefined && data.moods !== undefined
    }
}
