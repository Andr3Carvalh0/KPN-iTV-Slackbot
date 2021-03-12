const appstoreRating = require('./../../../schedule/modules/appstore/rating.js')
const appstoreReviews = require('./../../../schedule/modules/appstore/reviews.js')

module.exports = {
    process: function (req) {
        return req.header('X-iTV-Event') === 'Scheduler Task' && req.body.type === 'ios'
    },
    handle: function (req, res, next) {
        appstoreRating.execute()
        appstoreReviews.execute()
        res.json({message: `App Store Reviews task: started!`})
    }
}
