const configuration = require('./../../configuration/configurations')
const colors = require('./../others/colors.js')

const SIZE = 512
const USE_GOOGLE = configuration.USE_GOOGLE_TO_GENERATE_QR
const MARGIN = 5
const CORRECTION_LEVEL = "M"

function dark() {
    return colors.DARK.replace("#", "")
}

function light() {
    return colors.SUBTLE_GREY.replace("#", "")
}

module.exports = {
    qr: function (url) {
        if (USE_GOOGLE) {
            return `https://chart.googleapis.com/chart?cht=qr&chs=${SIZE}x${SIZE}&chl=${url}`
        } else {
            return `https://quickchart.io/qr?margin=${MARGIN}&size=${SIZE}&ecLevel=${CORRECTION_LEVEL}&dark=${dark()}&light=${light()}&text=${url}`
        }
    }
}
