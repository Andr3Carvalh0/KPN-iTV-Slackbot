const utilities = require('./text.js')

const SHORT_WORDS_COUNT = 10
const MID_WORDS_COUNT = 15
const CHANGELOG_MAX_LIMIT = 3050

module.exports = {
    process: function (text, options) {
        const processed = text.split("\n")
            .map(elem => elem.replace("\t", "").replace("\n", "").replace(/["']/g, ""))
            .filter(elem => {
                const lower = elem.toLowerCase()

                return !(
                    lower === "" ||
                    lower.includes("merge remote-tracking") ||
                    lower.includes("this reverts commit") ||
                    lower.includes("[release]") ||
                    lower.includes("build") && elem.length <= SHORT_WORDS_COUNT ||
                    lower.includes("code cleanup") && elem.length <= MID_WORDS_COUNT ||
                    lower.includes("cleanup") && elem.length <= SHORT_WORDS_COUNT ||
                    lower.includes("conflict") && elem.length <= MID_WORDS_COUNT ||
                    lower.includes("update") && lower.includes("module") ||
                    /\/(.*?)\/(.*?)\//g.test(lower)
                )
            })
            .map(elem => elem.replace("*", "•"))
            .map(elem => {
                const hasPrefix = options === undefined ? true : options.hasPrefix

                if (hasPrefix) {
                    return (elem.startsWith("•") ? elem : "• " + elem)
                }

                return elem
            })
            .map(elem => {
                const hasPrefix = options === undefined ? true : options.hasPrefix

                if (hasPrefix) {
                    return "` " + elem + " `"
                }

                return elem
            })
            .join(options === undefined || !options.newline ? " " : "\n")

        return utilities.trim(processed, CHANGELOG_MAX_LIMIT, "...`")
    },
    processError: function (text, exception, options) {
        return text.split("\n")
            .map(elem => elem.replace("\t", "").replace("\n", "").replace(/["']/g, ""))
            .map(elem => elem.replace(/[>]/g, "").replace(/[<]/g, "").replace(/[#]/g, ""))
            .map(elem => elem.replace(`${exception}:`, ""))
            .map(elem => utilities.capitalize(elem))
            .join(options === undefined || !options.newline ? " " : "\n")
            .trim()
    }
}
