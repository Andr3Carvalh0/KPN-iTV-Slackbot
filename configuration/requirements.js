const configuration = require('./configurations.js')
const fileSync = require('lowdb/adapters/FileSync')
const low = require('lowdb')
const path = require('./../utilities/filesystem/filesystem.js')
const S3 = require('@sadorlovsky/lowdb-s3')

const DATABASES = [
    require('./../app_store/data/local/database.js'),
    require('./../authentication/location/database.js'),
    require('./../builds/commits/data/database.js'),
    require('./../play_store/releases/data/database.js'),
    require('./../play_store/data/local/database.js'),
    require('./../firebase/data/local/database.js'),
    require('./../firebase/exceptions/data/database.js'),
    require('./../halo/data/local/database.js'),
    require('./../machine_learning/learning/data/database.js'),
    require('./../schedule/modules/data/database.js'),
    require('./../search/data/local/database.js'),
    require('./../urls/data/local/database.js')
]

const MACHINE_LEARNING_MODELS = configuration.USE_MACHINE_LEARNING ? [
    require('./../machine_learning/categories/categories.js'),
    require('./../machine_learning/toxicity/toxicity.js')
] : []

const S3_BUCKET_ID = configuration.S3_BUCKET_ID

module.exports = {
    initialize: function () {
        return Promise.all(
            DATABASES.map(elem => {
                return new Promise((res, rej) => {
                    if (configuration.USE_AMAZON_S3_TO_STORE_DATABASES) {
                        low(new S3({ bucket: S3_BUCKET_ID, key: `${elem.tag()}.json` }))
                            .then((instance) => res(instance))
                            .catch((error) => rej(error))
                    } else {
                        res(low(new fileSync(path.path(__dirname, `databases/${elem.tag()}.json`))))
                    }
                })
                    .then((instance) => elem.initialize(instance))
            }).concat(MACHINE_LEARNING_MODELS.map(e => e.initialize()))
        )
    }
}
