const BEGIN = '<table class="overview">'
const END = '</table>'
const CATEGORY = '<td class="categoryColumn">'
const MISSING_ISSUES = '<a href="#MissingIssues">'

const CATEGORY_START = '>'
const CATEGORY_END = '</a>'

const ISSUE_START = '<td class="countColumn">'
const ISSUE_END = '</td>'

module.exports = {
    parse: function (html) {
        const text = html.slice(html.indexOf(BEGIN), html.indexOf(END) + END.length)

        const categories = text.split(CATEGORY).slice(1)

        return categories.map(e => {
            if (e.includes(MISSING_ISSUES)) {
                return undefined
            } else {
                const lines = e.split("\n")

                const title = lines[0].slice(lines[0].indexOf(CATEGORY_START) + 1, lines[0].indexOf(CATEGORY_END))

                const issues = lines.slice(0, lines.length - 1).map(i => {
                    if (i.includes(ISSUE_START)) {
                        const tmp = i.slice(0, i.indexOf(ISSUE_END))

                        return parseInt(tmp.slice(tmp.indexOf(CATEGORY_START) + 1), 10)
                    } else {
                        return 0
                    }
                }).reduce((a, b) => a + b, 0)

                return {
                    issue: title,
                    count: issues
                }
            }
        }).filter(e => e !== undefined)
    }
}
