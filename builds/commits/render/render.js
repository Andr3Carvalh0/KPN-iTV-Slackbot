module.exports = {
    render: function (information) {
        return information === undefined ? 'unknown' : information.commit
    }
}
