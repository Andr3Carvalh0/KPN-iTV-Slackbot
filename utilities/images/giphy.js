const configuration = require('./../../configuration/configurations.js')
const fetcher = require('./../network/network.js')
const random = require('./../others/randomizer.js')

const ENDPOINT = 'https://api.giphy.com/v1/gifs/'
const ENDPOINT_SEARCH = 'search'

const KEY = configuration.GIPHY_KEY

const MIN_WEIRDNESS = 0
const MAX_WEIRDNESS = 20

function endpoint(text, offset) {
    return `${ENDPOINT}${ENDPOINT_SEARCH}?api_key=${KEY}&q=${text}&offset=${offset}`
}

function weirdness() {
    return random.generate(MIN_WEIRDNESS, MAX_WEIRDNESS)
}

module.exports = {
    random: function (text) {
        return new Promise((res, rej) => {
            fetcher.get({
                url: endpoint(text, weirdness())
            })
                .then(data => {
                    if (Array.isArray(data.data)) {
                        if (data.data.length === 0) {
                            rej("Didn't get any results")
                        }
                        const index = random.generate(0, data.data.length - 1)

                        res(data.data[index])
                    } else {
                        res(data.data)
                    }
                })
                .catch(error => rej('Fail to fetch'))
        })
    }
}
