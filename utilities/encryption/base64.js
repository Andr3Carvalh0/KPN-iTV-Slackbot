module.exports = {
    encode: function (value) {
        return btoa(value)
    },
    decode: function (value) {
        return atob(value)
    },
    encodeURLSafe: function (value) {
        return this.encode(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    }
}
