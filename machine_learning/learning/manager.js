const database = require('./data/database.js')
const time = require('./../../utilities/time/time.js')

module.exports = {
    reply: function (originalReview, translatedReview, originalReply, translatedReply, rating) {
        database.reply(originalReview, translatedReview, originalReply, translatedReply, rating)
    },
    rollout: function (name, code, percentage) {
        database.rollout(name, code, percentage, time.unix())
    }
}
