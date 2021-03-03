const configurations = require('./../configuration/configurations.js')
const locale = require('./../utilities/others/locale.js')
const translate = require('@vitalets/google-translate-api')

const AUTO = 'auto'
const TLD = 'com'

module.exports = {
    translate: function (texts) {
        return new Promise((res, rej) => {
            Promise.allSettled(texts.map(e =>
                translate(e, {
                    client: configurations.TRANSLATION_METHOD,
                    from: AUTO,
                    raw: false,
                    tld: TLD,
                    to: locale.ENGLISH
                })
            )).then(data => {
                const error = data.filter(e => e.status !== "fulfilled")

                if (error.length > 0) {
                    rej(error[0].reason)
                } else {
                    res(data.map((e, index) => {
                        return {
                            original: texts[index],
                            text: e.value.text,
                            translated: e.value.from.language.iso !== locale.ENGLISH
                        }
                    }))
                }
            })
                .catch((error) => rej(`There was a critical error when translating: ${error}`))
        })
    }
}
