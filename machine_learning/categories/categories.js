const collections = require('./../../utilities/collections/collections.js')
const path = require('./../../utilities/filesystem/filesystem.js')
const tensorflow = require('@tensorflow/tfjs-node')
const sentenceEncoder = require('@tensorflow-models/universal-sentence-encoder')

const MODEL_PATH = './machine_learning/categories/model/model.json'

function encode(data) {
    return new Promise((res, rej) => {
        _tokenizer.embed(data)
            .then((embeddings) => res(embeddings))
            .catch((error) => rej(error))
    })
}

let _model = undefined
let _tokenizer = undefined
const _labels = require('./model/categories.json')

module.exports = {
    initialize: function () {
        return new Promise((res, rej) => {
            Promise.allSettled([
                tensorflow.loadLayersModel(`file:///${path.fullpath(MODEL_PATH)}`),
                sentenceEncoder.load()
            ])
                .then((data) => {
                    _model = data[0].value
                    _tokenizer = data[1].value

                    res()
                })
                .catch((error) => rej(error))
        })
    },
    classify: function (text, threshold) {
        return new Promise((res, rej) => {
            encode(text)
                .then((embedding) => {
                    const results = _model.predict(embedding).dataSync()
                    const chunked = collections.chunk(results, _labels.length)

                    res(
                        chunked.map(result => {
                            return {
                                tag: _labels[collections.indexOfMax(result)],
                                confidence: chunked[collections.indexOfMax(result)]
                            }
                        }).map(e => e.confidence <= threshold ? undefined : e)[0]
                    )
                })
                .catch((error) => rej(error))
            })
    }
}
