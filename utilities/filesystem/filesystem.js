const fs = require('fs')
const path = require('path')
const resolve = path.resolve

function defaultSort(file1, file2) {
    return new Date(fs.statSync(file1).mtime.getTime()) - new Date(fs.statSync(file2).mtime.getTime())
}

module.exports = {
    directory: function (directory, sort) {
        const files = fs.readdirSync(directory)
        const items = []

        files.forEach(function (file) {
            if (!fs.statSync(path.join(directory, file)).isDirectory()) {
                items.push(path.join(directory, file))
            }
        })

        return items.sort(sort || defaultSort)
    },
    remove: function (file) {
        fs.unlink(file, err => {
            if (err) throw err
        })
    },
    size: function (directory) {
        const files = fs.readdirSync(directory)
        let size = 0

        files.forEach(function (file) {
            if (fs.statSync(path.join(directory, file)).isDirectory()) {
                size += size(path.join(directory, file))
            } else {
                size += fs.statSync(path.join(directory, file)).size
            }
        })

        return size
    },
    item: function (file) {
        return path.basename(file)
    },
    write: function (data, directory, file) {
        return new Promise((res, rej) => {
            fs.writeFile(path.join(directory, file), data, function (err) {
                if (!err) {
                    res("")
                } else {
                    rej(err)
                }
            })
        })
    },
    path: function (directory, file) {
        return path.join(directory, file)
    },
    fullpath: function (path) {
        return resolve(path)
    },
    exists: function (file) {
        return fs.existsSync(file)
    },
    read: function (file) {
        return fs.readFileSync(file);
    }
}
