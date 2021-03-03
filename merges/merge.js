const accounts = require('./users.js')
const colors = require('./../utilities/others/colors.js')
const images = require('./../utilities/images/images.js')
const jira = require('./../utilities/strings/jira.js')
const utilities = require('./../utilities/strings/text.js')

const DESCRIPTION_MAX_LIMIT = 2250

function common(body, title, action, color, subject) {
    let message = ""
    let label = ""

    if (body.object_attributes.description) {
        message = `${utilities.trim(jira.handleURL(body.object_attributes.description), DESCRIPTION_MAX_LIMIT)}`
    }

    if (body.labels !== undefined && body.labels.length > 0) {
        for (let index = 0; index < body.labels.length; ++index) {
            label += "`" + utilities.capitalize(body.labels[index].title) + "` "
        }
    } else {
        label = "`Improvements`"
    }

    let response = {
        attachments: [{
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: title + message
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
                            type: "mrkdwn",
                            text: "Information:"
                        }
                    ]
                },
                {
                    type: "section",
                    fields: [
                        {
                            type: "mrkdwn",
                            text: `*${subject}:*\n${accounts.route(body.user.name)}`
                        },
                        {
                            type: "mrkdwn",
                            text: `*Project:*\n${body.project.name}`
                        },
                        {
                            type: "mrkdwn",
                            text: `*Target branch:*\n${body.object_attributes.target_branch}`
                        },
                        {
                            type: "mrkdwn",
                            text: `*Source branch:*\n${body.object_attributes.source_branch}`
                        }
                    ]
                },
                {
                    type: "context",
                    elements: [
                        {
                            type: "mrkdwn",
                            text: "Tags:"
                        }
                    ]
                },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: label
                    }
                }
            ]
        }]
    }

    if (action !== undefined) {
        response.attachments[0].blocks.push(
            {
                type: "actions",
                elements: [
                    {
                        type: "button",
                        text: {
                            type: "plain_text",
                            emoji: true,
                            text: action
                        },
                        style: "primary",
                        url: body.object_attributes.url
                    }
                ]
            }
        )
    }

    if (color !== undefined) {
        response.attachments[0].color = color
    }

    return response
}

module.exports = {
    open: function (body) {
        return common(body, `A new merge request (*${jira.handleURL(body.object_attributes.title).replace('*', '')}*) was created :raised_hands:\n\n`, "Check it out! :sunglasses:", undefined, "Author")
    },
    approved: function (body) {
        return common(body, `(*${jira.handleURL(body.object_attributes.title).replace('*', '')}*) was approved! :tada:\n`, undefined, colors.SUCCESS, "Approved by")
    },
    close: function (body) {
        return common(body, `(*${jira.handleURL(body.object_attributes.title).replace('*', '')}*) was closed! :no_entry:\n`, undefined, undefined, "Author")
    },
    update: function (body) {
        return common(body, `(*${jira.handleURL(body.object_attributes.title).replace('*', '')}*) was updated!\n`, "Check it out! :sunglasses:", undefined, "Author")
    }
}
