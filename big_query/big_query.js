const configuration = require('./../configuration/configurations.js')
const {BigQuery: Big_query} = require('@google-cloud/bigquery')
const platforms = require('./../core/platforms.js')

const PROJECT_ID = configuration.BIG_QUERY_PROJECT_ID
const ANDROID_TABLE_ID = configuration.BIG_QUERY_ANDROID_TABLE_ID
const IOS_TABLE_ID = configuration.BIG_QUERY_IOS_TABLE_ID
const TABLE_SOURCE = configuration.BIG_QUERY_TABLE_SOURCE

const client = new Big_query({
    keyFilename: configuration.BIG_QUERY_CREDENTIALS,
    projectId: PROJECT_ID
})

function table(platform) {
    return `${PROJECT_ID}.${TABLE_SOURCE}.${platform === platforms.ANDROID ? ANDROID_TABLE_ID : IOS_TABLE_ID}`
}

function crashesForVersion(version, platform) {
    return `SELECT COUNT(DISTINCT event_id) as count FROM ${table(platform)} WHERE is_fatal = true AND DATE(event_timestamp) BETWEEN DATE_SUB(current_date(), INTERVAL 6 DAY) and current_date()`
}

module.exports = {
    crashes: function (version, platform) {
        return new Promise((res, rej) => {
            if (version.length === 0) {
                rej("Empty version")
            } else {
                client.query({
                    query: crashesForVersion(version, platform)
                })
                    .then(data => {
                        if (data.length === 0) {
                            rej("Not a valid response")
                        } else {
                            res(data[0][0].count)
                        }
                    })
                    .catch(err => rej(err))
            }
        })
    }
}
