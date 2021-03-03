const builds = require('./../../builds/render/builds.js')
const colors = require('./../../utilities/others/colors.js')
const images = require('./../../utilities/images/images.js')
const pathUtilities = require('./../../utilities/network/urls.js')

module.exports = {
    commandError: function (information) {
        return new Promise((res) => {
            images.sad().then((url) => {
                res({
                    attachments: [{
                        color: colors.FAILURE,
                        blocks: [
                            {
                                type: "section",
                                text: {
                                    type: "mrkdwn",
                                    text: `*There isn't any variant named '${information.type}'...*\n*Available options are:*\n\t* \`prod\`, \`production\` or \`release\` for release builds.*\n\t* \`uat\` or \`debug\` for UAT builds.*\n\t* \`preprod\` or \`preproduction\` for Pre-Production builds.*\n\t* \`sit\` for SIT builds.*`
                                },
                                accessory: {
                                    type: "image",
                                    image_url: url,
                                    alt_text: "Developed by André Carvalho"
                                }
                            }
                        ]
                    }]
                })
            })
        })
    },
    notFound: function () {
        return new Promise((res) => {
            images.surprise().then((url) => {
                res({
                    attachments: [{
                        color: colors.FAILURE,
                        blocks: [
                            {
                                type: "section",
                                text: {
                                    type: "mrkdwn",
                                    text: `*There isn't any build that matches your search...*`
                                },
                                accessory: {
                                    type: "image",
                                    image_url: url,
                                    alt_text: "Developed by André Carvalho"
                                }
                            }
                        ]
                    }]
                })
            })
        })
    },
    item: function (item) {
        return builds.build({
                'branch': item.branch,
                'changelog': item.changelog,
                'override': `*Here you go!*\n*A build from ${item.time} matches your search query! :mag:*`,
                'variant': item.type,
                'versionName': item.version,
                'versionCode': item.code
            },
            pathUtilities.path(item.url),
            false
        )
    }
}
