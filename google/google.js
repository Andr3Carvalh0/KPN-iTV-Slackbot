const fs = require('fs')
const {google} = require('googleapis')
const log = require('./../utilities/debug/logger.js')
const readline = require('readline')

const TAG = 'google.js'

function authorize(credentials, token, scopes) {
    return new Promise((res, rej) => {
        const {client_secret, client_id, redirect_uris} = credentials.installed
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])

        fs.readFile(token, (err, buffer) => {
            if (err) {
                log.e(TAG, 'Refreshing token...')

                refreshToken(oAuth2Client, scopes, token)
                    .then((client) => {
                        log.d(TAG, 'Refreshing token success!')
                        res(client)
                    })
                    .catch((error) => {
                        log.e(TAG, 'Refreshing token failed...')
                        rej(error)
                    })
            } else {
                log.d(TAG, 'Using stored token...')

                oAuth2Client.setCredentials(JSON.parse(buffer))
                res(oAuth2Client)
            }
        })
    })
}

function refreshToken(oAuth2Client, scopes, path) {
    return new Promise((res, rej) => {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
        })

        log.v(TAG, `Authorize this app by visiting this url:${authUrl}`)

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        })

        rl.question('Enter the code from that page here: ', (code) => {
            rl.close()
            oAuth2Client.getToken(code, (err, token) => {
                if (err) {
                    rej(err)
                } else {
                    oAuth2Client.setCredentials(token)

                    fs.writeFile(path, JSON.stringify(token), (err) => {
                        if (err) {
                            rej(err)
                        } else {
                            res(oAuth2Client)
                        }
                    })
                }
            })
        })
    })
}

module.exports = {
    authenticate: function (credentials, token, scopes) {
        return new Promise((res, rej) => {
            fs.readFile(credentials, (err, content) => {
                if (err) {
                    rej(`Error loading client secret file: ${err}`)
                } else {
                    authorize(JSON.parse(content), token, scopes)
                        .then((client) => res(client))
                        .catch((error) => rej(error))
                }
            })
        })
    },
    authenticateJWT: function (credentials, scopes) {
        return new Promise((res, rej) => {
            fs.readFile(credentials, (err, content) => {
                if (err) {
                    rej(`Error loading client secret file: ${err}`)
                } else {
                    const keys = JSON.parse(content)

                    try {
                        const jwt = new google.auth.JWT(keys.client_id, null, keys.private_key, scopes, null)

                        jwt.authorize(function (err, tokens) {
                            if (err) {
                                rej(`There was an error authenticating using the JWT token`)
                            } else {
                                res(jwt)
                            }
                        })
                    } catch (e) {
                        rej(`There was a problem loading the JWT token: ${e}`)
                    }
                }
            })
        })
    },
    gmail: function (client) {
        return google.gmail({version: 'v1', auth: client})
    },
    playConsole: function () {
        return google.androidpublisher('v3')
    }
}
