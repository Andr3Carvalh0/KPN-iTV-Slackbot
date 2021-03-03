const database = require('./data/repository.js')
const gmail = require('./../../gmail/gmail.js')
const machineLearning = require('./../../machine_learning/learning/manager.js')
const playstore = require('./../data/repository.js')
const render = require('./render/render.js')

const SUBJECT_TAG = 'Android release'
const DUTCH_LANGUAGE = 'nl-NL'

function handleXS4ALLReport(body, percentage) {
    if (percentage !== 1.0) {
        return new Promise((res) => res())
    }

    return new Promise((res, rej) => {
        try {
            const xs4all = require('./../../configuration/secrets/release_email_secrets.json')

            render.releaseEmail(body.name, body.code, body.nl)
                .then((view) => {
                    gmail.compose(
                        xs4all.from,
                        xs4all.to,
                        xs4all.cc,
                        `${SUBJECT_TAG} ${body.name} (21${body.code})`,
                        `${view}`
                    )
                        .then(() => res())
                        .catch((error) => rej(error))
                })
        } catch (e) {
            rej(e)
        }
    })
}

module.exports = {
    release: function (versionName, versionCode, percentage, notes) {
        database.remove()
        database.update(versionName, `21${versionCode}`, percentage)
        machineLearning.rollout(versionName, `21${versionCode}`, percentage)

        return new Promise((res, rej) => {
            Promise.allSettled([
                handleXS4ALLReport({
                    name: versionName,
                    code: versionCode,
                    nl: notes[0]
                }, percentage),
                render.release(versionName, versionCode, percentage * 100, notes)
            ])
                .then((data) => res(data[1].value))
                .catch((error) => rej(error))
        })
    },
    rollout: function () {
        return new Promise((res, rej) => {
            const local = database.fetch()

            if (local !== undefined) {
                playstore.rollout()
                    .then((release) => {
                        if (
                            release === undefined ||
                            local.name === release.name &&
                            local.code === release.code &&
                            local.percentage === release.percentage
                        ) {
                            rej("We didnt detect any change in the rollout.")
                        } else {
                            if (release.percentage === 1.0) {
                                database.remove()
                            } else {
                                database.update(release.name, release.code, release.percentage)
                            }

                            machineLearning.rollout(release.name, release.code, release.percentage)

                            Promise.allSettled([
                                render.rollout(release.name, release.code, release.percentage * 100),
                                handleXS4ALLReport({
                                    name: release.name,
                                    code: release.code,
                                    nl: release.notes.filter(e => e.language === DUTCH_LANGUAGE).length > 0
                                        ? release.notes.filter(e => e.language === DUTCH_LANGUAGE)[0].text
                                        : 'Unknown'
                                }, release.percentage)
                            ])
                                .then((data) => res(data[0].value))
                                .catch((err) => rej(err))
                        }
                    })
                    .catch((err) => rej(err))
            } else {
                rej("There isnt any rollout going on.")
            }
        })
    }
}
