const configuration = require('./../../../configuration/configurations.js')
const slack = require('./../../../utilities/network/slack.js')

module.exports = {
    fetch: function (time) {
        return new Promise((res, rej) => {
            slack.conversations(
                configuration.SLACK_TOKEN,
                configuration.FIREBASE_MESSAGES_CHANNEL,
                time,
                100,
                false
            )
                .then(data => {
                    if (data.messages === undefined || data.messages.length === 0) {
                        rej(Error('Empty list of results!'))
                    } else {
                        res(
                            data.messages
                                .filter(e => e.subtype !== undefined && e.attachments !== undefined && e.attachments.length > 0)
                                .map(e => {
                                    return {
                                        time: e.ts,
                                        title: e.text,
                                        version: e.attachments[0].fields.filter(f => f.title === 'Version')[0].value,
                                        error: e.attachments[0].fields.filter(f => f.title === 'Summary')[0].value
                                    }
                                })
                        )
                    }
                }).catch(error => rej(error))
        })
    }
}
