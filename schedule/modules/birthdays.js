const colors = require('./../../utilities/others/colors.js')
const configuration = require('./../../configuration/configurations.js')
const log = require('./../../utilities/debug/logger.js')
const network = require('./../../utilities/slack/manager.js')
const timer = require('./../../utilities/time/time.js')

function notify(channel, body) {
    return network.post(channel, body)
}

const dates = [
    {
        date: "27/01",
        title: ":tada: *IT'S THE BIRTHDAY OF THE MOST KARAOKE TALENTED/WINE LOVER DEVELOPER KPN WILL EVER HAVE!!! *:tada:\nTo celebrate lets have a karaoke and drink some wine! :flag-pt:",
        description: "André Carvalho",
        picture: "https://i.imgur.com/Zns5ocu.png"
    },
    {
        date: "01/04",
        title: ":tada: *IT'S MY BIRTHDAY!!! *:tada:\n:frits::frits::frits::frits::frits: for the best owner eva! <@andre.b.carvalho> :stuck_out_tongue:",
        description: "Frits",
        picture: "https://i.imgur.com/EPkxZUN.png"
    }
]

function render(title, description, picture) {
    return {
        attachments: [{
            color: colors.SURPRISE,
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
                    image_url: picture,
                    alt_text: description,
                    title: {
                        type: "plain_text",
                        text: description,
                        emoji: true
                    }
                }
            ]
        }]
    }
}

const TAG = 'birthdays.js'

module.exports = {
    time: function () {
        return timer.hours(1)
    },
    execute: function () {
        if (parseInt(timer.now('H')) === timer.BEGIN_DAY) {
            dates.filter(e => e.date === timer.now('DD/MM'))
                .forEach(e => {
                    notify(
                        configuration.TEAMS_CHANNEL,
                        render(e.title, e.description, e.picture)
                    )
                        .then(() => log.i(TAG, 'Birthday sent!'))
                        .catch((err) => log.e(TAG, err))
                })
        }
    }
}
