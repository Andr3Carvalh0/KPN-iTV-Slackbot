const data = require('./../location/database.js')

module.exports = {
    isWhitelisted: function (req) {
        const ip = this.ip(req)

        if ((ip === '127.0.0.1' || ip === '::1')) { return true }

        return data.whitelisted().includes(ip)
    },
    ip: function (req) {
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

        if (ip.includes('::ffff:')) { ip = ip.split(':').reverse()[0] }

        return ip
    }
}
