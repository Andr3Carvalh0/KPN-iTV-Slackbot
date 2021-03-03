const accounts = require('./users.js')
const formatter = require('./../utilities/strings/messages.js')
const images = require('./../utilities/images/images.js')
const jira = require('./../utilities/strings/jira.js')
const keywords = require('./../utilities/strings/keywords.js')
const text = require('./../utilities/strings/text.js')

module.exports = {
    note: function (body) {
        return {
            attachments: [{
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: `*${accounts.route(body.user.name)}* left a comment on *${jira.handleURL(body.merge_request.title).replace('*', '')}*`
                        },
                        accessory: {
                            type: "image",
                            image_url: images.route(body.project.id),
                            alt_text: "Developed by André Carvalho"
                        }
                    },
                    {
                        type: "context",
                        elements: [
                            {
                                type: "plain_text",
                                text: "Message:"
                            }
                        ]
                    },
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: text.capitalize(
                                keywords.handle(
                                    jira.handleURL(
                                        formatter.process(body.object_attributes.note, {
                                            hasPrefix: false,
                                            newline: true
                                        })
                                    )
                                )
                            )
                        }
                    },
                    {
                        type: "actions",
                        elements: [
                            {
                                type: "button",
                                text: {
                                    type: "plain_text",
                                    emoji: true,
                                    text: "Check it out :see_no_evil:"
                                },
                                style: "primary",
                                url: body.object_attributes.url
                            }
                        ]
                    }
                ]
            }
            ]
        }
    }
}
