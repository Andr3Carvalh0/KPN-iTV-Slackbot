const colors = require('./../../utilities/others/colors.js')
const images = require('./../../utilities/images/images.js')

const CRITICAL_TITLE = "@here Velocity Alert! Crashes are spiking for an issue in the last hour. :bullettrain_side:"
const NON_FATAL_TITLE = "Heads up! A wild new non-fatal issue has appeared. :female-construction-worker:"

function convert(data) {
    const message = [
        {
            type: "context",
            elements: [
                {
                    type: "mrkdwn",
                    text: "Issue:"
                }
            ]
        },
        {
            type: "section",
            fields: [
                {
                    type: "mrkdwn",
                    text: `*Class:*\n${data.problem}`
                },
                {
                    type: "mrkdwn",
                    text: `*Version:*\n${data.version}`
                }
            ]
        },
        {
            type: "actions",
            elements: [
                {
                    type: "button",
                    text: {
                        type: "plain_text",
                        emoji: true,
                        text: "Check it out :skier:"
                    },
                    style: "primary",
                    url: `${data.url}`
                }
            ]
        }
    ]

    if (data.line !== -1) {
        message[1].fields.push(
            {
                type: "mrkdwn",
                text: `*Line:*\n${data.line}`
            }
        )
    }

    if (data.cause !== undefined) {
        message[1].fields.push(
            {
                type: "mrkdwn",
                text: `*Probable cause:*\n${data.cause}`
            }
        )
    }

    return message
}

function process(data, isCritical) {
    const messages = []

    data.forEach(e => {
        const message = {
            attachments: [{
                color: isCritical ? colors.FAILURE : colors.SURPRISE,
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: isCritical ? CRITICAL_TITLE : NON_FATAL_TITLE
                        },
                        accessory: {
                            type: "image",
                            image_url: images.firebase(),
                            alt_text: "Developed by André Carvalho"
                        }
                    }
                ]
            }]
        }

        convert(e).forEach(e => {
            message.attachments[0].blocks.push(e)
        })

        messages.push(message)
    })

    return messages
}

module.exports = {
    render: function (data) {
        return {
            critical: data.critical.length > 0 ? process(data.critical, true) : undefined,
            nonFatal: data.nonFatal.length > 0 ? process(data.nonFatal, false) : undefined
        }
    }
}
