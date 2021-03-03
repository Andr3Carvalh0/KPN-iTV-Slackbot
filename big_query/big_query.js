const configuration = require('./../configuration/configurations.js')
const {BigQuery: Big_query} = require('@google-cloud/bigquery')

const PROJECT_ID = configuration.BIG_QUERY_PROJECT_ID
const TABLE_ID = configuration.BIG_QUERY_TABLE_ID
const TABLE_SOURCE = configuration.BIG_QUERY_TABLE_SOURCE
const TABLE = `${PROJECT_ID}.${TABLE_SOURCE}.${TABLE_ID}`

const client = new Big_query({
    keyFilename: configuration.BIG_QUERY_CREDENTIALS,
    projectId: PROJECT_ID
})

function crashesForVersion(version) {
    return `SELECT COUNT(DISTINCT event_id) as count FROM ${TABLE} WHERE application.display_version = '${version}' AND is_fatal = true AND DATE(event_timestamp) BETWEEN DATE_SUB(current_date(), INTERVAL 6 DAY) and current_date()`
}

async function query(options) {
    return await client.query(options)
}

module.exports = {
    crashes: function (version) {
        return new Promise((res, rej) => {
            if (version.length === 0) {
                rej("Empty version")
            } else {
                query({
                    query: crashesForVersion(version)
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
