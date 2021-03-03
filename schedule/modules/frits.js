const colors = require('./../../utilities/others/colors.js')
const configuration = require('./../../configuration/configurations.js')
const log = require('./../../utilities/debug/logger.js')
const network = require('./../../utilities/slack/manager.js')
const timer = require('./../../utilities/time/time.js')

function notify(channel, body) {
    return network.post(channel, body)
}

function render() {
    return {
        attachments: [{
            color: colors.SURPRISE,
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: ":tada: *IT'S MY BIRTHDAY!!!*:tada:\n:frits::frits::frits::frits::frits: for the best owner eva! <@andre.b.carvalho> :stuck_out_tongue:"
                    }
                },
                {
                    type: "image",
                    image_url: "https://i.imgur.com/EPkxZUN.png",
                    alt_text: "Frits",
                    title: {
                        type: "plain_text",
                        text: "Frits",
                        emoji: true
                    }
                }
            ]
        }]
    }
}

const TAG = 'frits.js'

module.exports = {
    time: function () {
        return timer.hours(1)
    },
    execute: function () {
        if (
            timer.now('DD/MM') === "01/04" &&
            parseInt(timer.now('H')) === timer.BEGIN_DAY
        ) {
            notify(
                configuration.TEAMS_CHANNEL,
                render()
            )
                .then(() => log.i(TAG, 'Frits birthday sent!'))
                .catch((err) => log.e(TAG, err))
        }
    }
}
