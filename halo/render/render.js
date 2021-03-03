const images = require('./../../utilities/images/images.js')

module.exports = {
    cache: function (metadata) {
        return new Promise((res) => {
            res({
                attachments: [{
                    blocks: [
                        {
                            type: "section",
                            text: {
                                type: "mrkdwn",
                                text: `*${metadata.author} updated${metadata.amount > 1 ? ` ${metadata.amount}x times` : ""} the Halo image cache version!*`
                            },
                            accessory: {
                                type: "image",
                                image_url: images.route(-999),
                                alt_text: "Developed by André Carvalho"
                            }
                        }
                    ]
                }]
            })
        })
    }
}
