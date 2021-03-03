const locale = require('./../../../utilities/others/locale.js')
const network = require('./../../../utilities/network/network.js')

module.exports = {
    rating: function (id) {
        return new Promise((res, rej) => {
            network.get({
                url: `https://itunes.apple.com/lookup?id=${id}&country=${locale.DUTCH}&entity=software`
            })
                .then((data) => {
                    res({
                        score: data.results[0].averageUserRating,
                        scoreText: data.results[0].averageUserRating.toFixed(1),
                        version: data.results[0].version
                    })
                })
                .catch((error) => rej(error))
        })
    },
    reviews: function (id, amount) {
        return new Promise((res, rej) => {
            network.get({
                url: `https://itunes.apple.com/${locale.DUTCH}/rss/customerreviews/page=1/id=${id}/sortby=mostRecent/json`
            })
                .then((data) => {
                    if (data.feed === undefined || data.feed.entry.length === 0) {
                        rej("Invalid response")
                    } else {
                        const items = data.feed.entry.map((e) => {
                            return {
                                id: e.id.label,
                                userName: e.author.name.label,
                                title: e.title.label,
                                text: e.content.label,
                                scoreText: parseInt(e['im:rating'].label),
                                version: e['im:version'].label
                            }
                        }).splice(0, amount)

                        res({
                            data: items
                        })
                    }
                })
                .catch((error) => rej(error))
        })
    }
}
