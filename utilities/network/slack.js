const network = require('./../../utilities/network/network.js')

const SLACK_API_ENDPOINT = 'https://slack.com/api'

function post(endpoint, token, view, type) {
    return network.post({
        url: endpoint,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': type || 'application/json',
            'Accept': 'application/json'
        },
        message: view
    })
}

function get(endpoint, token) {
    return network.get({
        url: endpoint,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
}

module.exports = {
    openModal: function (token, trigger, body) {
        return post(
            `${SLACK_API_ENDPOINT}/views.open`,
            token,
            {
                trigger_id: trigger,
                view: body
            })
    },
    ephemeral: function (token, channelId, text, userId) {
        return post(`${SLACK_API_ENDPOINT}/chat.postEphemeral`, token, {
                'attachments': {},
                'channel': channelId,
                'text': text,
                'user': userId
            },
            'application/x-www-form-urlencoded')
    },
    conversations: function (token, channelId, time, amount, inclusive) {
        return get(
            `${SLACK_API_ENDPOINT}/conversations.history?channel=${channelId}&oldest=${time}&limit=${amount}&inclusive=${inclusive}`,
            token
        )
    },
    editConversations: function (token, channelId, messageId, attachments) {
        return post(
            `${SLACK_API_ENDPOINT}/chat.update`,
            token,
            {
                'attachments': attachments,
                'channel': channelId,
                'ts': messageId
            }
        )
    },
    postConversation: function (token, channelId, attachments, text) {
        return post(
            `${SLACK_API_ENDPOINT}/chat.postMessage`,
            token,
            {
                'channel': channelId,
                'text': text || "",
                'attachments': attachments
            }
        )
    },
    messageThread: function (token, channelId, messageId, attachments) {
        return post(
            `${SLACK_API_ENDPOINT}/chat.postMessage`,
            token,
            {
                'channel': channelId,
                'thread_ts': messageId,
                'text': "",
                'attachments': attachments
            }
        )
    },
    leaveEmoticon: function (token, channelId, messageId, emoji) {
        return post(
            `${SLACK_API_ENDPOINT}/reactions.add`,
            token,
            {
                'channel': channelId,
                'name': emoji,
                'timestamp': messageId
            }
        )
    }
}
