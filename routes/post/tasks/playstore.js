const playstoreRating = require('../../../schedule/modules/playstore/rating.js')
const playstoreReviews = require('../../../schedule/modules/playstore/reviews.js')

module.exports = {
    process: function (req) {
        return req.header('X-iTV-Event') === 'Scheduler Task' && req.body.type === 'android'
    },
    handle: function (req, res, next) {
        playstoreRating.execute()
        playstoreReviews.execute()
        res.json({message: `Play Store Rating & Reviews task: started!`})
    }
}
