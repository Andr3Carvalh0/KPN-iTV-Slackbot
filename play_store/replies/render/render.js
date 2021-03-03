const constants = require('./../../constants.js')
const images = require('./../../../utilities/images/images.js')
const reviewRender = require('./../../../core/store/render/review.js')
const text = require('./../../../utilities/strings/text.js')

module.exports = {
    input: function (id, user, review) {
        return {
            type: "modal",
            callback_id: id,
            title: {
                type: "plain_text",
                text: "Reply to a review"
            },
            submit: {
                type: "plain_text",
                text: "Reply"
            },
            close: {
                type: "plain_text",
                text: "Cancel"
            },
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `*${text.capitalizeOnSpace(user)} commented:*`
                    }
                },
                reviewRender.review(review),
                {
                    type: "divider"
                },
                {
                    type: "input",
                    block_id: "response_text_view",
                    element: {
                        type: "plain_text_input",
                        multiline: true,
                        action_id: "response_text",
                        placeholder: {
                            type: "plain_text",
                            text: "Jot something down..."
                        }
                    },
                    label: {
                        type: "plain_text",
                        text: "What would you like to say?"
                    }
                }
            ]
        }
    },
    permissions: function () {
        return {
            type: "modal",
            title: {
                type: "plain_text",
                text: "Ooopsie"
            },
            close: {
                "type": "plain_text",
                "text": "Okeeey!"
            },
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: "You dont have permission to do this!\nYou can request it by asking <@andre.b.carvalho> for it."
                    },
                    accessory: {
                        type: "image",
                        image_url: images.notApproved(),
                        alt_text: "Andre doesnt approve"
                    }
                }
            ]
        }
    },
    invalid: function () {
        return {
            type: "modal",
            title: {
                type: "plain_text",
                text: "Ohhh Ohhh"
            },
            close: {
                "type": "plain_text",
                "text": "Okeeey!"
            },
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: "There was a problem with the review you are trying to reply to.\nPlease contact <@andre.b.carvalho>"
                    },
                    accessory: {
                        type: "image",
                        image_url: images.notApproved(),
                        alt_text: "Andre doesnt approve"
                    }
                }
            ]
        }
    },
    reply: function (user, translation, commenterId) {
        return {
            attachments: [{
                blocks: [
                    {
                        type: "context",
                        elements: [
                            {
                                type: "mrkdwn",
                                text: `<@${commenterId}> has replied to a review${user === undefined || user.toLowerCase() === constants.GOOGLE_USER.toLowerCase() ? "!" : ` from ${text.capitalizeOnSpace(user)}!`}`
                            }
                        ]
                    },
                    reviewRender.review({
                        review: translation
                    })
                ]
            }]
        }
    }
}
