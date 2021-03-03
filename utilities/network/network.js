const fetch = require('node-fetch')
const log = require('./../debug/logger.js')
const text = require('./../strings/text.js')

const TAG = 'network.js'

const GET = 'GET'
const POST = 'POST'

function call(url, options) {
    return new Promise((res, rej) => {
        const message = {
            method: options.method,
            headers: options.headers || {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }

        if (options.method !== GET) {
            message.body = message.headers["Content-Type"] === 'application/json' ? JSON.stringify(options.message || "") : new URLSearchParams(options.message || {})
        }

        const _url = text.replace(url, /\s/g, '%20')

        log.d(TAG, `${options.method}: ${_url}`)

        fetch(_url, message)
            .then(response => {
                if (!response.ok) {
                    throw Error(response.statusText)
                }

                new Promise((resolve) => resolve(response.json()))
                    .then((json) => res(json))
                    .catch(() => res(response))
            })
            .catch(error => rej(error))
    })
}

module.exports = {
    post: function (options) {
        return call(options.url, {
            method: POST,
            headers: options.headers,
            message: options.message
        })
    },
    get: function (options) {
        return call(options.url, {
            method: GET,
            headers: options.headers
        })
    }
}
