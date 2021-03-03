let database

const ROLLOUT_TABLE_NAME = "ROLLOUT"

module.exports = {
    initialize: function (instance) {
        database = instance

        database.defaults({
            ROLLOUT: []
        }).write()
    },
    tag: function () {
        return 'rollout'
    },
    fetch: function () {
        const item = database.get(ROLLOUT_TABLE_NAME).value()

        return item.length > 0 ? item[0] : undefined
    },
    update: function (name, code, percentage) {
        const items = database.get(ROLLOUT_TABLE_NAME).value()

        if (items.length > 0) {
            items[0].name = name
            items[0].code = code
            items[0].percentage = percentage
        } else {
            items.push({
                'name': name,
                'code': code,
                'percentage': percentage
            })
        }

        database.get(ROLLOUT_TABLE_NAME).write()
    },
    remove: function () {
        database.get(ROLLOUT_TABLE_NAME)
            .remove(({
                         name,
                         code,
                         percentage
                     }) => true)
            .write()
    }
}
