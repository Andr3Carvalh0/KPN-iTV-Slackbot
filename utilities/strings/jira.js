const configuration = require('./../../configuration/configurations.js')
const stringUtilities = require('./text.js')

const JIRA_ISSUE_REGEX = new RegExp(configuration.JIRA_US_PATTERN, 'gi')
const JIRA_ENDPOINT = configuration.JIRA_URL

module.exports = {
    handleURL: function (text) {
        return stringUtilities.replace(text, JIRA_ISSUE_REGEX, (t) => `<${JIRA_ENDPOINT}${t.toUpperCase()}|${t.toUpperCase()}>`)
    }
}
