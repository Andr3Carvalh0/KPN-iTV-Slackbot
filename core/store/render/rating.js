const FULL_STAR = '★'
const EMPTY_STAR = '☆'
const HALF = '½'

const MAX_STARS = 5

module.exports = {
    render: function (amount, renderEmptyStars) {
        const renderEmpty = renderEmptyStars === undefined ? true : renderEmptyStars
        const value = Math.round(amount)

        let text = ""

        for (let index = 0; index < value; index++) {
            text += FULL_STAR
        }

        if (renderEmpty) {
            for (let index = 0; index < MAX_STARS - value; index++) {
                text += EMPTY_STAR
            }
        }

        return text
    }
}
