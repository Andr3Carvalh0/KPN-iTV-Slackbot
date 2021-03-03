const accounts = new Map([
    ["carva503", "André Carvalho"],
    ["alvar509", "Davidaz"],
    ["verhe532", "Jasper Verheugt"],
    ["zine500", "Senna Zine"]
])

module.exports = {
    route: function (id) {
        if (accounts.has(id)) {
            return accounts.get(id)
        }

        return id
    }
}
