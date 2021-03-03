const render = require('./render/render.js')
const repository = require('./data/local/database.js')
const search = require('./../utilities/search/search.js')
const time = require('./../utilities/time/time')

const DELTA_THRESHOLD = 1

const LATEST_ID = 0
const LATEST_TYPE = 2

const MERGE_COMMIT_MESSAGE = "Merge remote-track"
const ORIGIN = "origin/"

const GIVE_LATEST = false

const types = [
    {
        "key": "Latest",
        "values": ["latest"]
    },
    {
        "key": "Play Store",
        "values": ["prod", "production", "release"]
    },
    {
        "key": "User Acceptance",
        "values": ["uat", "debug"]
    },
    {
        "key": "Pre-Production",
        "values": ["preprod", "preproduction"]
    },
    {
        "key": "System Integration",
        "values": ["sit"]
    }
]

function isMerged(item, items, previous) {
    // To prevent the case where the child branch name is contained in the parent child name
    // Eg: starting with develop1 -> merge into develop
    // On this case without this condition we would loop here forever since the new branch name(develop)
    // is contained in develop1
    if (previous !== undefined && item.time === previous.time) return item

    const iteration = items.filter(e => {
        return e.changelog.includes(MERGE_COMMIT_MESSAGE) && e.changelog.includes(ORIGIN) && e.changelog.includes(item.branch)
    })

    if (iteration.length === 0) return item

    const sorted = iteration.sort((e1, e2) => e2.code - e1.code)

    return isMerged(sorted[0], items, item)
}

function latest(items) {
    return items.sort((e1, e2) => new Date(e2.timestamp) - new Date(e1.timestamp))[0]
}

module.exports = {
    query: function (information) {
        return new Promise((res, rej) => {
            let type = search.levenshtein(information.type, types, (e) => e.values)

            if (type.delta > DELTA_THRESHOLD) {
                render.commandError(information).then((view) => {
                    rej(view)
                })
            } else {
                let isLatest = type.index === LATEST_ID

                if (isLatest) {
                    type.index = LATEST_TYPE

                    const variant = search.levenshtein(information.query, types, (e) => e.values)

                    if (variant.delta <= DELTA_THRESHOLD) {
                        type = variant
                    }
                }

                const items = repository.get().filter(v => v.type === types[type.index].key)

                const results = (items.length > 0) ? (isLatest) ? [{'item': items[0]}] : search.fuzzy(information.query, items) : []

                if (results.length > 0) {
                    const lookup = results[0].item
                    const child = isMerged(lookup, items)
                    const parent = latest(items.filter(v => v.branch === child.branch))

                    const item = GIVE_LATEST || isLatest ? parent : lookup

                    res(render.item(item))
                }

                render.notFound().then((view) => {
                    rej(view)
                })
            }
        })
    },
    process: function (information) {
        return new Promise((res) => {
            repository.add({
                "branch": information.branch,
                "type": information.type,
                "version": information.version,
                "code": information.code,
                "changelog": information.changelog,
                "url": information.url,
                "time": time.now(),
                "timestamp": time.timestamp(),
                "isTV": information.isTV
            })
            res()
        })
    }
}
