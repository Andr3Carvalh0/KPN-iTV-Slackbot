const configuration = require('./../../configuration/configurations.js')
const network = require('./../network/network.js')
const slack = require('./../network/slack.js')

module.exports = {
    post: function (channel, message) {
        if (channel.includes('/')) {
            return network.post({
                'url': channel,
                'message': message
            })
        } else {
            return new Promise((res, rej) => {
                if (configuration.SLACK_TOKEN === '') {
                    rej('You have a invalid slack token!')
                } else {
                    slack.postConversation(
                        configuration.SLACK_TOKEN,
                        channel,
                        message.attachments
                    )
                        .then((data) => {
                            if (data.ok) {
                                res(data)
                            } else {
                                rej(data.error)
                            }
                        })
                        .catch((error) => rej(error))
                }
            })
        }
    }
}