const colors = require('./../../utilities/others/colors.js')
const configuration = require('./../../configuration/configurations.js')
const formatter = require('./../../utilities/strings/messages.js')
const images = require('./../../utilities/images/images.js')
const qr = require('./../../utilities/shortener/qr.js')
const time = require('./../../utilities/time/time.js')

const SHORT_WORDS_COUNT = 10

function branch(value) {
    return value.replace("feature/", "")
        .replace("bugs/", "")
        .replace("refactor/", "")
        .replace("/", "_")
        .replace("(", "-")
        .replace(")", "")
}

module.exports = {
    tests: function (body) {
        const isSuccess = body.total <= body.success + body.skipped

        return {
            attachments: [{
                color: (isSuccess ? colors.SUCCESS : colors.FAILURE),
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: ":robot_face: *Unit tests report!* :robot_face:"
                        },
                        accessory: {
                            type: "image",
                            image_url: images.unitTests(),
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
                                text: `*Execution time:*\n${body.time}ms`
                            },
                            {
                                type: "mrkdwn",
                                text: `*Branch:*\n${branch(body.branch)}`
                            },
                            {
                                type: "mrkdwn",
                                text: `*Date:*\n${time.now('DD/MM')}`
                            },
                            {
                                type: "mrkdwn",
                                text: `*Time:*\n${time.now('HH:mm')}`
                            }
                        ]
                    },
                    {
                        type: "context",
                        elements: [
                            {
                                type: "mrkdwn",
                                text: "Results:"
                            }
                        ]
                    },
                    {
                        type: "section",
                        fields: [
                            {
                                type: "mrkdwn",
                                text: `*Status:*\n${(isSuccess ? ':raised_hands:' : ':expressionless:')}`
                            },
                            {
                                type: "mrkdwn",
                                text: `*Skipped:*\n${body.skipped} of ${body.total}`
                            },
                            {
                                type: "mrkdwn",
                                text: `*Successful:*\n${body.success} of ${body.total}`
                            },
                            {
                                type: "mrkdwn",
                                text: `*Failed:*\n${body.failed} of ${body.total}`
                            }
                        ]
                    }
                ]
            }]
        }
    },
    build: function (body, url, isTV) {
        const androidTV = isTV === undefined ? false : isTV
        const branchName = branch(body.branch)
        const notes = (formatter.process(body.changelog).length <= SHORT_WORDS_COUNT ? "` • None?! `" : formatter.process(body.changelog))

        let title = "*A new build is available!* :raised_hands:"
        let color = ""

        if (branchName !== "release" && branchName !== "develop") {
            title = "*A new build is available!* :raised_hands:\n*This is a build from a feature branch, so some functionalities might be missing & bugs are expected :smile:!*"
            color = colors.EXPERIMENT
        }

        if (body.variant === "Play Store") {
            title = "*A brand new Play Store build is available!* :fire:"
            color = colors.SUCCESS
        }

        if (body.override !== undefined) {
            title = body.override
        }

        const imageURL = androidTV ? images.androidTV() : (url !== undefined ? qr.qr(url) : images.blank())

        let response = {
            attachments: [{
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: title
                        },
                        accessory: {
                            type: "image",
                            image_url: imageURL,
                            alt_text: "Developed by André Carvalho"
                        }
                    },
                    {
                        type: "context",
                        elements: [
                            {
                                type: "mrkdwn",
                                text: "Build information:"
                            }
                        ]
                    },
                    {
                        type: "section",
                        fields: [
                            {
                                type: "mrkdwn",
                                text: `*Variant:*\n${body.variant}`
                            },
                            {
                                type: "mrkdwn",
                                text: `*Version:*\n${body.versionName}`
                            },
                            {
                                type: "mrkdwn",
                                text: `*Code:*\n21${body.versionCode}`
                            },
                            {
                                type: "mrkdwn",
                                text: `*Branch:*\n${branchName}`
                            }
                        ]
                    },
                    {
                        type: "context",
                        elements: [
                            {
                                type: "mrkdwn",
                                text: "Build changes:"
                            }
                        ]
                    },
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: notes
                        }
                    }
                ]
            }]
        }

        if (color !== "") {
            response.attachments[0].color = color
        }

        if (androidTV) {
            response.attachments[0].blocks.push(
                {
                    type: "actions",
                    elements: [
                        {
                            type: "button",
                            text: {
                                type: "plain_text",
                                emoji: true,
                                text: "Download :skier:"
                            },
                            style: "primary",
                            url: url
                        }
                    ]
                }
            )
        }

        return response
    },
    manual: function (body, url) {
        let response = {
            attachments: [{
                color: colors.EXPERIMENT,
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: `*A brand new ${body.brand} build is available!* :raised_hands:`
                        },
                        accessory: {
                            type: "image",
                            image_url: (url !== undefined ? qr.qr(url) : images.blank()),
                            alt_text: "Developed by André Carvalho"
                        }
                    },
                    {
                        type: "context",
                        elements: [
                            {
                                type: "mrkdwn",
                                text: "Build information:"
                            }
                        ]
                    }
                ]
            }]
        }

        const information = {
            type: "section",
            fields: [
                {
                    type: "mrkdwn",
                    text: `*Variant:*\n${body.variant}`
                }
            ]
        }

        if (body.versionName !== undefined && body.versionName.length > 0) {
            information.fields.push(
                {
                    type: "mrkdwn",
                    text: `*Version:*\n${body.versionName}`
                }
            )
        }

        if (body.versionCode !== undefined && body.versionCode.length > 0) {
            information.fields.push(
                {
                    type: "mrkdwn",
                    text: `*Code:*\n21${body.versionCode}`
                }
            )
        }

        response.attachments[0].blocks.push(information)

        if (body.changelog !== undefined && body.changelog.length > 0) {
            response.attachments[0].blocks.push(
                {
                    type: "context",
                    elements: [
                        {
                            type: "mrkdwn",
                            text: "Build changes:"
                        }
                    ]
                }
            )

            response.attachments[0].blocks.push(
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: formatter.process(body.changelog)
                    }
                }
            )
        }

        return response
    },
    error: function (body) {
        return new Promise((res) => {
            const reason = `${body.title} exception was raised!`
            const stacktrace = formatter.processError(
                body.reason,
                body.title,
                {
                    newline: true
                }
            )

            images.broken().then((url) => {
                res({
                    attachments: [{
                        color: colors.FAILURE,
                        blocks: [
                            {
                                type: "section",
                                text: {
                                    type: "mrkdwn",
                                    text: "*There was a problem while building the project.* :scream_cat:"
                                },
                                accessory: {
                                    type: "image",
                                    image_url: url,
                                    alt_text: "Developed by André Carvalho"
                                }
                            },
                            {
                                type: "section",
                                text: {
                                    type: "mrkdwn",
                                    text: `*Reason:*\n\n${reason}\n\n${stacktrace === undefined ? "" : "*Backtrace:*\n\n```" + stacktrace + "```\n\n"}`
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
                                            text: "Check it out :exploding_head:"
                                        },
                                        style: "danger",
                                        url: configuration.JENKINS_URL
                                    }
                                ]
                            }
                        ]
                    }]
                })
            })
        })
    }
}
