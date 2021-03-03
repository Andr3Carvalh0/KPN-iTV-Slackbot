let database

const PHONE_TABLE_NAME = 'PHONE'
const TV_TABLE_NAME = 'TV'

function table(platform) {
    return platform === 'app' ? PHONE_TABLE_NAME : TV_TABLE_NAME
}

module.exports = {
    initialize: function (instance) {
        database = instance

        database.defaults({
            PHONE: [],
            TV: []
        }).write()
    },
    tag: function () {
        return 'commits'
    },
    all: function (platform) {
        return database.get(table(platform)).cloneDeep().value()
    },
    fetch: function (branch, platform) {
        return database.get(table(platform))
            .find({name: branch})
            .cloneDeep()
            .value()
    },
    update: function (branch, platform, hash, timestamp) {
        const items = database.get(table(platform)).value()

        const query = database.get(table(platform)).find({name: branch}).value()

        if (query !== undefined) {
            query.commit = hash
            query.timestamp = timestamp
        } else {
            items.push({
                'name': branch,
                'commit': hash,
                'timestamp': timestamp
            })
        }

        database.get(table(platform)).write()
    },
    remove: function (branch, platform) {
        database.get(table(platform))
            .remove(({
                         name,
                         commit,
                         timestamp
                     }) => name === branch)
            .write()
    }
}
