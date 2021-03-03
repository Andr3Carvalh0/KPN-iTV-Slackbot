const path = require('./../../utilities/filesystem/filesystem.js')
const tensorflow = require('@tensorflow/tfjs-node')
const sentenceEncoder = require('@tensorflow-models/universal-sentence-encoder')

const MODEL_PATH = './machine_learning/toxicity/model/model.json'

let _model = undefined
let _tokenizer = undefined
let _labels = undefined

function encode(data) {
    return new Promise((res, rej) => {
        _tokenizer.embed(data)
            .then((embeddings) => res(embeddings))
            .catch((error) => rej(error))
    })
}

module.exports = {
    initialize: function () {
        return new Promise((res, rej) => {
            Promise.allSettled([
                tensorflow.loadGraphModel(`file:///${path.fullpath(MODEL_PATH)}`),
                sentenceEncoder.load()
            ])
                .then((data) => {
                    _model = data[0].value
                    _tokenizer = data[1].value.tokenizer
                    _labels = _model.outputs.map((d) => d.name.split('/')[0])

                    res()
                })
                .catch((error) => rej(error))
        })
    },
    isToxic : function (text, threshold) {
        return new Promise((res, rej) => {
            const inputs = [text]
            const encodings = inputs.map(d => _tokenizer.encode(d))

            const indicesArr = encodings.map((arr, i) => arr.map((d, index) => [i, index]))

            let flattenedIndicesArr = []

            for (let i = 0; i < indicesArr.length; i++) {
                flattenedIndicesArr = flattenedIndicesArr.concat(indicesArr[i])
            }

            const indices = tensorflow.tensor2d(flattenedIndicesArr, [flattenedIndicesArr.length, 2], 'int32')

            const values = tensorflow.tensor1d(tensorflow.util.flatten(encodings), 'int32')

            _model.executeAsync({
                Placeholder_1: indices,
                Placeholder: values
            }).then((labels) => {
                indices.dispose()
                values.dispose()

                res(labels.map((e, i) => {
                    return {
                        data: e,
                        headIndex: i
                    }
                }).map((e) => {
                    const prediction = e.data.dataSync()
                    const results = []

                    for (let input = 0; input < inputs.length; input++) {
                        const probabilities = prediction.slice(input * 2, input * 2 + 2)
                        let match = null

                        if (Math.max(probabilities[0], probabilities[1]) > threshold) {
                            match = probabilities[0] < probabilities[1]
                        }

                        results.push({probabilities, match})
                    }

                    return { label: _labels[e.headIndex], results, isToxic: results.filter(e => e.match).length > 0}
                }).filter(e => e.isToxic))
            })
        })
    }
}
