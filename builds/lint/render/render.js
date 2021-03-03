const images = require('./../../../utilities/images/images.js')

module.exports = {
    render: function (information, download) {
        return {
            attachments: [{
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: ":robot_face: *Lint report!* :robot_face:"
                        },
                        accessory: {
                            type: "image",
                            image_url: images.lint(),
                            alt_text: "Developed by André Carvalho"
                        }
                    },
                    {
                        type: "context",
                        elements: [
                            {
                                type: "mrkdwn",
                                text: "Issues reported:"
                            }
                        ]
                    },
                    {
                        type: "section",
                        fields: information.map(e => {
                            return {
                                type: "mrkdwn",
                                text: `*${e.issue}:*\n${e.count}`
                            }
                        })
                    },
                    {
                        type: "actions",
                        elements: [
                            {
                                type: "button",
                                text: {
                                    type: "plain_text",
                                    emoji: true,
                                    text: "Check out the details :android1: "
                                },
                                style: "primary",
                                url: `${download}`
                            }
                        ]
                    }
                ]
            }]
        }
    }
}
