const configuration = require('./../../configuration/configurations.js')
const time = require('./../../utilities/time/time.js')

function format(type, tag, message) {
    return `${time.now('YYYY-MM-DD HH:mm:ss')} ${type}/${tag}: ${message}`
}

function print(message) {
    console.log(message)
}

module.exports = {
    d: function (tag, message) {
        if (!configuration.IS_PRODUCTION) {
            print(format('D', tag, message))
        }
    },
    e: function (tag, message) {
        print(format('E', tag, message))
    },
    i: function (tag, message) {
        print(format('I', tag, message))
    },
    v: function (tag, message) {
        print(format('V', tag, message))
    },
    w: function (tag, message) {
        print(format('W', tag, message))
    },
    wtf: function (tag, message) {
        print(format('WTF', tag, message))
    }
}
