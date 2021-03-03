const configuration = require('./../../../configuration/configurations.js')
const google = require('./../../../google/google.js')

const SCOPES = ['https://mail.google.com/']
const UNREAD = 'UNREAD'

function client(client) {
    return google.gmail(client)
}

module.exports = {
    authenticate: function () {
        return google.authenticate(
            configuration.GMAIL_CREDENTIALS,
            configuration.GMAIL_TOKEN,
            SCOPES
        )
    },
    messages: function (auth, userId, maxResults, query) {
        return new Promise((resolve, rej) => {
            client(auth).users.messages.list({
                userId: userId,
                maxResults: maxResults,
                q: query
            }, (err, res) => {
                if (!err && res.data.resultSizeEstimate !== 0) {
                    const messages = res.data.messages
                    const proceeded = []

                    messages.forEach((message, index) => {
                        client(auth).users.messages.get({
                            userId: userId,
                            format: 'full',
                            id: messages[index].id
                        }, (err, res) => {
                            if (!err) {
                                proceeded.push(res.data)

                                if (proceeded.length === messages.length) {
                                    if (proceeded.length > 0) {
                                        resolve(proceeded)
                                    } else {
                                        rej("No messages match the query.")
                                    }
                                }
                            } else {
                                rej("No messages found.")
                            }
                        })
                    })
                } else {
                    rej("No messages found.")
                }
            })
        })
    },
    markAsRead: function (auth, userId, messageId) {
        return new Promise((resolve, rej) => {
            client(auth).users.messages.modify({
                userId: userId,
                id: messageId,
                requestBody: {
                    removeLabelIds: [UNREAD]
                }
            }, (err) => {
                if (!err) {
                    resolve()
                } else {
                    rej("Couldn't mark the email as read")
                }
            })
        })
    },
    attachments: function (auth, userId, messageId, id) {
        return new Promise((resolve, rej) => {
            client(auth).users.messages.attachments.get(
                {
                    userId: userId,
                    messageId: messageId,
                    id: id
                }, (err, res) => {
                    if (err) {
                        rej("Couldn't download attachment")
                    } else {
                        resolve(res.data.data)
                    }
                })
        })
    },
    send: function (auth, userId, headers, message) {
        return new Promise((resolve, rej) => {
            client(auth).users.messages.send({
                userId: userId,
                requestBody: {
                    raw: message
                }
            }, (err, res) => {
                if (err) {
                    rej("Couldn't send email :(")
                } else {
                    resolve(res)
                }
            })
        })
    }
}
