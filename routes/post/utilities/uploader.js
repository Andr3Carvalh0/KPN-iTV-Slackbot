const filesystem = require('./../../../utilities/filesystem/filesystem.js')
const multer = require('multer')
const path = require('./../../../utilities/network/urls.js')
const urls = require('./../../../urls/manager.js')

function filename(file, extension, prefix, count) {
    return `${prefix !== undefined ? prefix + "_" : ""}${file.replace(`.${extension}`, "")}${count === 0 ? "" : `_${count}`}.${extension}`
}

function pathInFilesystem(name, directory, extension, prefix, count, transform) {
    return filesystem.fullpath(`${directory}/${transform(name, extension, prefix, count)}`)
}

module.exports = {
    upload: function (req, res, options, callback) {
        const transform = ((file, extension, prefix, count) => {
            if (options.name !== undefined) {
                return options.name(file, extension, prefix, count, options.transform(req))
            } else {
                return filename(file, extension, prefix, count)
            }
        })

        const upload = multer({
            storage: multer.diskStorage({
                destination: function (req, file, cb) {
                    cb(null, options.directory)
                },
                filename: function (req, file, cb) {
                    const name = file.originalname
                    const extension = file.originalname.substr(file.originalname.lastIndexOf('.') + 1)
                    let count = 0

                    while (filesystem.exists(pathInFilesystem(name, extension, options.directory, options.prefix, count, transform))) {
                        count++
                    }

                    cb(null, `${transform(name, extension, options.prefix, count)}`)
                }
            })
        }).single(options.extension)

        upload(req, res, function (err) {
            const body = options.transform(req)
            const file = (req.fileValidationError || err || !req.file) ? options.fallback(body) : req.file.path

            let url = undefined
            let short = undefined

            if (file !== undefined) {
                short = urls.short(file, options.fallback(body))
                url = path.path(short)
            }

            callback(short, url, body, filesystem.fullpath(req.file.path))
        })
    }
}
