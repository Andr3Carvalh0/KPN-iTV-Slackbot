const filesystem = require('./../../utilities/filesystem/filesystem.js')
const fs = require('fs')
const parser = require('./data/parser.js')
const render = require('./render/render.js')

module.exports = {
    handle: function (path, url) {
        return new Promise((res, rej) => {
            if (!filesystem.exists(path)) {
                rej('File doesnt exist!')
            } else {
                fs.readFile(path, (err, buffer) => {
                    if (err) {
                        rej('Failed to read file.')
                    } else {
                        const data = parser.parse(buffer.toString())

                        res(render.render(data.sort((a, b) => b.count - a.count), url))
                    }
                })
            }
        })
    }
}
