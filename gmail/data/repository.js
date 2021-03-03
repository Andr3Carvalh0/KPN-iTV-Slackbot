const configuration = require('./../../configuration/configurations.js')
const decode = require('./../../utilities/encryption/base64.js')
const filesystem = require('./../../utilities/filesystem/filesystem.js')
const gmail = require('./remote/gmail.js')
const log = require('./../../utilities/debug/logger.js')
const path = require('path')
const time = require('./../../utilities/time/time.js')

const PDF_FILE_NAME = configuration.REPORT_FILE_NAME
const PDF_FILE_EXTENSION = `.${configuration.REPORT_FILE_EXTENSION}`

const MAX_RESULTS = 3
const USER_ID = 'me'
const QUERY = 'subject: GA Dashboard has:attachment is:unread older_than:0d newer_than:3d'

const TAG = 'repository.js'

const TO = 'To'
const FROM = 'From'
const CC = 'Cc'
const SUBJECT = 'Subject'
const CONTENT_TYPE = 'Content-Type'
const HTML = "text/html"

function processAttachment(binaryData) {
    const base64str = binaryData.replace(/_/g, '/').replace(/-/g, '+').replace(/\s/g, '')
    const binary = decode.decode(base64str)

    const buffer = new ArrayBuffer(binary.length)
    const view = new Uint8Array(buffer)

    for (let i = 0; i < binary.length; i++) {
        view[i] = binary.charCodeAt(i)
    }

    return view
}

function handleAttachment(data) {
    return new Promise((res, rej) => {
        const file = processAttachment(data)

        const filename = `${PDF_FILE_NAME}_${time.now("DD_MM")}${PDF_FILE_EXTENSION}`

        filesystem.write(file, `${path.join(__dirname, `..`, `..`, configuration.REPORTS_DIRECTORY)}`, filename)
            .then(() => {
                res(filesystem.path(configuration.REPORTS_DIRECTORY, filename))
            })
            .catch((err) => {
                rej(err)
            })
    })
}

function transformHeader(key, value) {
    let v = value

    if (!Array.isArray(v)) {
        v = [v]
    }

    return v.map(e => {
        return {
            name: key,
            value: e
        }
    })
}

function encodeEmail(headers, message) {
    return decode.encodeURLSafe(
        `${headers.reduce((v1, v2) => `${v1}${v2.name}: ${v2.value}\r\n`, "")}\r\n${message}`
    )
}

module.exports = {
    hasReport: function () {
        return new Promise((res, rej) => {
            log.d(TAG, 'Authenticating...')
            gmail.authenticate()
                .then((client) => {
                    log.d(TAG, 'Getting messages...')
                    gmail.messages(client, USER_ID, MAX_RESULTS, QUERY)
                        .then((messages) => {
                            const attachment = messages[0].payload.parts.filter(i => i.filename.includes(PDF_FILE_EXTENSION))

                            if (attachment.length > 0) {
                                log.d(TAG, `Getting attachments for message ${messages[0].id}...`)
                                gmail.attachments(client, USER_ID, messages[0].id, attachment[0].body.attachmentId)
                                    .then((content) => {
                                        log.d(TAG, `Marking message ${messages[0].id} as read...`)
                                        gmail.markAsRead(client, USER_ID, messages[0].id)
                                            .then(() => {
                                                handleAttachment(content)
                                                    .then((data) => res(data))
                                                    .catch((error) => rej(error))
                                            })
                                            .catch((error) => rej(error))
                                    })
                                    .catch((error) => rej(error))
                            } else {
                                rej("Couldn't find the message with attachment")
                            }
                        })
                        .catch((error) => rej(error))
                })
                .catch((error) => rej(error))
        })
    },
    send: function (from, to, cc, subject, message) {
        return new Promise((res, rej) => {
            gmail.authenticate()
                .then((client) => {
                    const headers = [
                        transformHeader(TO, to),
                        transformHeader(CC, cc),
                        transformHeader(SUBJECT, subject),
                        transformHeader(FROM, `'${from.name}' <${from.address}>`),
                        transformHeader(CONTENT_TYPE, HTML)
                    ].flat(1)

                    gmail.send(client, USER_ID, headers, encodeEmail(headers, message))
                        .then(() => res())
                        .catch((error) => rej(error))
                })
                .catch((error) => rej(error))
        })
    }
}
