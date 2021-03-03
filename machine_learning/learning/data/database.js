let database

const REPLY_TABLE_NAME = 'REPLIES'
const ROLLOUT_TABLE_NAME = 'ROLLOUT'

function add(table, value) {
    const items = database.get(table).value()
    items.push(value)
    database.get(ROLLOUT_TABLE_NAME).write()
}

module.exports = {
    initialize: function (instance) {
        database = instance

        database.defaults({
            REPLIES: [],
            ROLLOUT: []
        }).write()
    },
    tag: function () {
        return 'machine_learning'
    },
    reply: function (originalReview, translatedReview, originalReply, translatedReply, rating) {
        add(REPLY_TABLE_NAME, {
            review: {
                text: originalReview,
                translated: translatedReview
            },
            reply: {
                text: originalReply,
                translated: translatedReply
            },
            rating: rating
        })
    },
    rollout: function (name, code, percentage, timestamp) {
        add(ROLLOUT_TABLE_NAME, {
            versionName: name,
            versionCode: code,
            percentage: percentage,
            timestamp: timestamp
        })
    }
}
