const database = require('./local/database.js')
const exceptions = require('./../exceptions/exceptions.js')
const network = require('./remote/slack.js')

function process(item, title) {
    const error = item.error.replace('<', '').replace('>', '').split('|')
    const line = error[1].split(' ')

    return {
        title: title,
        url: error[0],
        problem: line[0],
        line: line[2] || -1,
        cause: exceptions.issue(
            {
                file: line[0],
                line: line[2] || -1
            }
        ),
        version: item.version
    }
}

module.exports = {
    process: function () {
        return new Promise((res, rej) => {
            const time = database.getTimestamp()

            network.fetch(time)
                .then(data => {
                    const critical = data.filter(e => !e.title.includes('non-fatal') && !e.title.includes('Regression detected!'))
                        .map(e => process(e))

                    const nonFatal = data.filter(e => e.title.includes('non-fatal') || e.title.includes('Regression detected!'))
                        .map(e => process(e))
                        .filter(e => !database.wasReported(e, false))

                    const timestamp = data.sort((value1, value2) => parseInt(value2.time.replace(/\./g, ''), 10) - parseInt(value1.time.replace(/\./g, ''), 10))[0].time

                    database.setTimestamp(timestamp)
                    database.push(critical, true)
                    database.push(nonFatal, false)

                    res({
                        critical: critical,
                        nonFatal: nonFatal
                    })
                })
                .catch(error => rej('No new Firebase messages'))
        })
    }
}
