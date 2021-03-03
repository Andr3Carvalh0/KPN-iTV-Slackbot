const database = require('./local/database.js')
const log = require('./../../utilities/debug/logger.js')
const remote = require('./remote/halo.js')

const TAG = 'repository.js'

const CACHE_MODULE = 'ImageCache'

module.exports = {
    cache: function () {
        return new Promise((res, rej) => {
            remote.modules([CACHE_MODULE])
                .then((data) => {
                    log.d(TAG, data)

                    const updatedBy = data[0].updatedBy
                    const remoteVersion = data[0].values.version
                    const localVersion = database.cacheVersion()

                    if (localVersion === remoteVersion) {
                        rej(Error('No change detected!'))
                    } else {
                        database.updateCacheVersion(remoteVersion)
                        res({
                            author: updatedBy,
                            amount: remoteVersion - localVersion
                        })
                    }
                })
                .catch((err) => {
                    log.e(TAG, err)
                    rej(err)
                })
        })
    }
}
