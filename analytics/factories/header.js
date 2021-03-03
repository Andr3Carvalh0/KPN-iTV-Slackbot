const images = require('./../../utilities/images/images.js')

const ANDROID = 0

module.exports = {
    get: function (platform) {
        const emoji = platform === ANDROID ? ":android1:" : ":black_phone:"

        return {
            type: "section",
            text: {
                type: "mrkdwn",
                text: `${emoji} *Weekly analytics* ${emoji}`
            },
            accessory: {
                type: "image",
                image_url: platform === ANDROID ? images.analytics() : images.iOSAnalytics(),
                alt_text: "Developed by André Carvalho"
            }
        }
    }
}
