const color = require('./../../../utilities/others/colors.js')
const configuration = require('./../../../configuration/configurations.js')
const images = require('./../../../utilities/images/images.js')
const random = require('./../../../utilities/others/randomizer.js')
const rating = require('./rating.js')
const text = require('./../../../utilities/strings/text.js')
const time = require('./../../../utilities/time/time.js')

function transform(isOriginal, item) {
    return ''
}

const EASTER_EGG_MIN_BOUND = 0
const EASTER_EGG_MAX_BOUND = 10
const EASTER_EGG_THRESHOLD = 3

const POSITIVE_REVIEW_THRESHOLD = 3

function device(manufacturer, device) {
    if (manufacturer === undefined) {
        return (random.generate(EASTER_EGG_MIN_BOUND, EASTER_EGG_MAX_BOUND) < EASTER_EGG_THRESHOLD)
            ? 'Hema Toaster 750w'
            : 'Unknown'
    } else {
        return `${text.capitalize(manufacturer)} ${text.capitalize(device)}`
    }
}

function version(version) {
    return text.capitalize(version)
}

function android(version) {
    return `${version.version}`
}

function header(review, options) {
    const items = [
        (options.displayVersion === undefined ? true : options.displayVersion) ? `:kpn: *${version(review.version)}*` : undefined,
        (options.displayDevice === undefined ? review.manufacturer !== undefined || review.device !== undefined : options.displayDevice) ? `:black_phone:*${device(review.manufacturer, review.device)}*` : undefined,
        (options.displayOS === undefined ? review.os !== undefined : options.displayOS) ? `:android1: *${android(review.os)}*` : undefined,
        (options.displayRating === undefined ? true : options.displayRating) ? `:star2: ${rating.render(review.rating)}` : undefined
    ].filter((e) => e !== undefined)

    if (items.length === 0) {
        return `${options.prefix}:`
    }

    return `${options.prefix} (${items.join(' | ')})${options.hasSuffix || false ? `${review.previous !== undefined ? " has updated their review!" : ` on ${time.from(review.date).format("DD/MM")} commented:`}` : `:`}`
        .replace(' :black_phone:', ':black_phone:')
}

function body(item, prefix) {
    prefix = prefix || transform

    const reviews = [item.review.original, item.review.translated]
        .filter(e => e !== undefined && e !== '')
        .map(e => {
            return {
                type: "mrkdwn",
                text: (prefix(e === item.review.original, item) + "```" + e + "```").trim()
            }
        })
        .filter((e) => e !== undefined)

    if (reviews.length === 0) {
        return undefined
    }

    return {
        type: "section",
        fields: reviews.length < 2 ? undefined : reviews,
        text: reviews.length > 1 ? undefined : reviews[0]
    }
}

module.exports = {
    rating: function (header, rating) {
        return new Promise((res) => {
            const isHappy = parseInt(rating.current.replace(/\./g, ''), 10) > parseInt(rating.previous.replace(/\./g, ''), 10)
            const title = (isHappy)
                ? `@here The ${header} rating went up from *${rating.previous}* to *${rating.current}* :confetti_ball:`
                : `@here The ${header} rating went down from *${rating.previous}* to *${rating.current}* :disappointed:`
            const image = (isHappy) ? images.happy() : images.sad()
            const description = (isHappy) ? `PORTUGAL CARALHO!!!` : `Opa.... foda-se :(`

            image.then((url) => {
                res({
                    attachments: [{
                        color: (isHappy) ? color.SUCCESS : color.FAILURE,
                        blocks: [
                            {
                                type: "section",
                                text: {
                                    type: "mrkdwn",
                                    text: title
                                }
                            },
                            {
                                type: "image",
                                image_url: url,
                                alt_text: "Developed by André Carvalho",
                                title: {
                                    type: "plain_text",
                                    text: description
                                }
                            }
                        ]
                    }]
                })
            })
        })
    },
    reviews: function (review, options) {
        const isUpdate = review.previous !== undefined
        const url = options !== undefined ? options.url : undefined
        const prefix = options !== undefined ? options.prefix : transform

        return {
            attachments: [{
                color: review.rating >= POSITIVE_REVIEW_THRESHOLD ? color.SUCCESS : color.FAILURE,
                blocks: [
                    {
                        type: "context",
                        elements: [
                            {
                                type: "mrkdwn",
                                text: header(review, {
                                    prefix: `${text.capitalizeOnSpace(review.name)}`,
                                    hasSuffix: true
                                })
                            }
                        ]
                    },
                    configuration.USE_MACHINE_LEARNING && review.isToxic ? {
                            type: "context",
                            elements: [
                                {
                                    type: "mrkdwn",
                                    text: `:triangular_flag_on_post: We recommend you to flag this review!`
                                }
                            ]
                        } : undefined,
                    isUpdate ? {
                        type: "context",
                        elements: [
                            {
                                type: "mrkdwn",
                                text: header(review.previous, {
                                    displayVersion: review.version !== review.previous.version,
                                    displayDevice: review.device !== review.previous.device,
                                    displayOS: review.os !== undefined && review.previous.os ? review.os.name !== review.previous.os.name : false,
                                    displayRating: review.rating !== review.previous.rating,
                                    prefix: `Previously`
                                })
                            }
                        ]
                    } : undefined,
                    isUpdate ? body(review.previous, prefix) : undefined,
                    isUpdate ? {
                        type: "context",
                        elements: [
                            {
                                type: "mrkdwn",
                                text: "Was updated to:"
                            }
                        ]
                    } : undefined,
                    body(review, prefix),
                    {
                        type: "actions",
                        block_id: url !== undefined ? undefined : `view_${review.id}`,
                        elements: [
                            {
                                type: "button",
                                text: {
                                    type: "plain_text",
                                    text: `Reply to ${text.capitalizeOnSpace(review.name)}`
                                },
                                style: "primary",
                                value: url !== undefined ? undefined : review.id,
                                action_id: url !== undefined ? undefined : "reply_review",
                                url: url !== undefined ? url : undefined
                            }
                        ]
                    }
                ].filter(e => e !== undefined)
            }]
        }
    },
    review: function (review, prefix) {
        prefix = prefix || transform

        return body(review, prefix)
    }
}
