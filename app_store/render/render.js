const render = require('./../../core/store/render/review.js')

function link(appId, reviewId) {
    return `https://appstoreconnect.apple.com/WebObjects/iTunesConnect.woa/ra/ng/app/${appId}/ios/ratingsResponses?reviewId=${reviewId}`
}

module.exports = {
    rating: function (rating) {
        return render.rating('App Store', rating)
    },
    reviews: function (appId, review) {
        return render.reviews(review, {
            url: link(appId, review.id),
            prefix: ((isOriginal, item) => {
                if (isOriginal) {
                    return `${item.title.original !== undefined && item.title.original !== "" ? `*${item.title.original}*\n` : ""}`
                } else {
                    if (item.title.translated !== undefined && item.title.translated !== "") {
                        return `*${item.title.translated}*\n`
                    } else {
                        return `${item.title.original !== undefined && item.title.original !== "" ? `*${item.title.original}*\n` : ""}`
                    }
                }
            })
        })
    }
}
