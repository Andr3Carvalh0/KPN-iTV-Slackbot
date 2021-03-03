const colors = require('./../../../utilities/others/colors.js')
const images = require('./../../../utilities/images/images.js')

module.exports = {
    release: function (name, code, percentage, notes) {
        return new Promise((res) => {
            res({
                attachments: [{
                    color: colors.SUCCESS,
                    blocks: [
                        {
                            type: "section",
                            text: {
                                type: "mrkdwn",
                                text: `@here Version *${name}* (*21${code}*) was just released to 30%! :tada:`
                            },
                            accessory: {
                                type: "image",
                                image_url: images.release(),
                                alt_text: "Developed by André Carvalho"
                            }
                        },
                        {
                            type: "context",
                            elements: [
                                {
                                    type: "mrkdwn",
                                    text: "What's new:"
                                }
                            ]
                        },
                        {
                            type: "section",
                            fields: [
                                {
                                    type: "mrkdwn",
                                    text: "```" + notes[0] + "```"
                                },
                                {
                                    type: "mrkdwn",
                                    text: "```" + notes[1] + "```"
                                }
                            ]
                        }
                    ]
                }]
            })
        })
    },
    releaseEmail: function (name, code, notes) {
        const transformedNotes = notes.replace('\n', '<br>')

        return new Promise((res) => {
            res(`<html>
                    <body>
                        <p>Hi,</p>
                        <p>We have just released an update to the Android app with the following release notes:</p>
                        <p>${transformedNotes}</p>
                        <p>As usual, you can find the build in <a href="https://appcenter.ms/users/nikki-hoogenboom-qv3d/apps/XS4ALL-Televisie">Appcenter.</a></p>
                        <p>Any questions feel free to ask,<br>André Carvalho</p>
                        </body>
                    </html>`)
        })
    },
    rollout: function (name, code, percentage) {
        return new Promise((res) => {
            res({
                attachments: [{
                    color: colors.SUCCESS,
                    blocks: [
                        {
                            type: "section",
                            text: {
                                type: "mrkdwn",
                                text: `@here The rollout for version *${name}* (*${code}*) was increased to ${percentage}%! :tada:`
                            },
                            accessory: {
                                type: "image",
                                image_url: images.release(),
                                alt_text: "Developed by André Carvalho"
                            }
                        }
                    ]
                }]
            })
        })
    }
}
