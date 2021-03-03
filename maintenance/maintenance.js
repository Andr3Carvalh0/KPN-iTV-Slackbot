const commits = require('./../builds/commits/data/repository.js')
const filesystem = require('./../utilities/filesystem/filesystem.js')
const log = require('./../utilities/debug/logger.js')
const platform = require('./../builds/platform.js')
const time = require('./../utilities/time/time.js')

const CLEANUP_AMOUNT_FILE = 10
const CLEANUP_TRIGGER = 1000000000 // +/- 1gb
const MAX_LIFE_BRANCH = time.days(31)

const PLATFORMS = [platform.APP, platform.TV]
const PROTECTED_BRANCHES = ['develop', 'navigation', 'release']

const TAG = 'maintenance.js'

module.exports = {
    filesystem: function (directory) {
        if (filesystem.size(directory) >= CLEANUP_TRIGGER) {
            const files = filesystem.directory(directory).filter((elem) => !elem.includes(platform.TV)).slice(0, CLEANUP_AMOUNT_FILE)

            files.forEach(file => {
                log.i(TAG, `Removing "${filesystem.item(file)}".`)
                filesystem.remove(file)
            })
        }
    },
    databases: function () {
        PLATFORMS.forEach(platform => {
            commits.all(platform)
                .filter(elem => elem.timestamp + MAX_LIFE_BRANCH < time.unix() && !PROTECTED_BRANCHES.includes(elem.name))
                .forEach(elem => {
                    log.i(TAG, `Removing "${elem.name}" for platform "${platform}" from the commit hash database.`)
                    commits.remove(elem.name, platform)
                })
        })
    }
}
