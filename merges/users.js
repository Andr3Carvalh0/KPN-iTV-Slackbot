function accounts() {
    try {
        return new Map(require('./../configuration/secrets/gitlab_users.json'))
    } catch (e) {
        return new Map([])
    }
}

module.exports = {
    route: function (id) {
        if (accounts().has(id)) {
            return accounts().get(id)
        }

        return id
    }
}
