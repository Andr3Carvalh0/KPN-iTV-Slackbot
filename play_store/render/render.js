const render = require('./../../core/store/render/review.js')

module.exports = {
    reviews: function (review) {
        return render.reviews(review)
    },
    rating: function (rating) {
        return new Promise((res) => {
            render.rating(':android1: Play Store', rating)
                .then((view) => res(view))
        })
    }
}
