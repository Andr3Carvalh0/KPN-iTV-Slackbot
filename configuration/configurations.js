const configuration = require('./configuration.json')
const filesystem = require('./../utilities/filesystem/filesystem.js')
const path = require('path')

const BASE_SLACK_URL = 'https://hooks.slack.com/services/'

function parseSlackChannel(info) {
    return info.includes('/') ? `${BASE_SLACK_URL}${info}` : info
}

module.exports = {
    ADMIN_SIGNING_SECRET: configuration.ADMIN_SIGNING_SECRET,
    ANDROID_TV_CHANNEL: parseSlackChannel(configuration.ANDROID_TV_CHANNEL),
    APP_STORE_APPLICATION_ID: configuration.APP_STORE_APPLICATION_ID,
    APK_DIRECTORY: `resources/apks/`,
    APK_FILE_EXTENSION: `apk`,
    BASE_URL: configuration.BASE_URL,
    BIG_QUERY_CREDENTIALS: filesystem.fullpath(filesystem.path(__dirname, 'secrets/big_query_credentials.json')),
    BIG_QUERY_PROJECT_ID: configuration.BIG_QUERY_PROJECT_ID,
    BIG_QUERY_TABLE_ID: configuration.BIG_QUERY_TABLE_ID,
    BIG_QUERY_TABLE_SOURCE: configuration.BIG_QUERY_TABLE_SOURCE,
    BUILDS_CHANNEL: parseSlackChannel(configuration.BUILDS_CHANNEL),
    BUILD_COMMAND_TOKEN: configuration.BUILD_COMMAND_TOKEN,
    DISABLE_BIG_QUERY: configuration.DISABLE_BIG_QUERY,
    DISABLE_FIREBASE_REPORTS: configuration.DISABLE_FIREBASE_REPORTS,
    DISABLE_FRIDAY_REPORTS: configuration.DISABLE_FRIDAY_REPORTS,
    DRY_RUN: configuration.DRY_RUN,
    ERRORS_FILE: configuration.ERRORS_FILE,
    FIREBASE_CHANNEL: parseSlackChannel(configuration.FIREBASE_CHANNEL),
    FIREBASE_MESSAGES_CHANNEL: configuration.FIREBASE_MESSAGES_CHANNEL,
    GITLAB_CHANNEL: parseSlackChannel(configuration.GITLAB_CHANNEL),
    GIPHY_KEY: configuration.GIPHY_KEY,
    GMAIL_CREDENTIALS: filesystem.fullpath(filesystem.path(__dirname, 'secrets/gmail_credentials.json')),
    GMAIL_TOKEN: filesystem.fullpath(filesystem.path(__dirname, 'secrets/gmail_token.json')),
    HALO_ENDPOINT: configuration.HALO_ENDPOINT,
    HALO_USER: configuration.HALO_USER,
    HALO_PASSWORD: configuration.HALO_PASSWORD,
    HTTP_PROTOCOL: configuration.HTTP_PROTOCOL,
    IOS_RELEASE_CHANNEL: parseSlackChannel(configuration.IOS_RELEASE_CHANNEL),
    IOS_REVIEWS_CHANNEL: parseSlackChannel(configuration.IOS_REVIEWS_CHANNEL),
    IS_PRODUCTION: configuration.IS_PRODUCTION,
    JENKINS_URL: configuration.JENKINS_URL,
    JIRA_URL: configuration.JIRA_URL,
    JIRA_US_PATTERN: configuration.JIRA_US_PATTERN,
    LINT_DIRECTORY: `resources/lint/`,
    LINT_FILE_EXTENSION: `html`,
    LOGS_FILE: configuration.LOGS_FILE,
    MAX_UPLOAD_SIZE: `50mb`,
    PLAY_STORE_APPLICATION_ID: configuration.PLAY_STORE_APPLICATION_ID,
    PLAY_STORE_CREDENTIALS: filesystem.fullpath(filesystem.path(__dirname, 'secrets/play_store_credentials.json')),
    PORT: process.env.PORT || 3000,
    RELEASE_CHANNEL: parseSlackChannel(configuration.RELEASE_CHANNEL),
    REPORT_FILE_EXTENSION: `pdf`,
    REPORT_FILE_NAME: `report`,
    REPORTS_DIRECTORY: `resources/reports/`,
    RESOURCES_DIRECTORY: `${path.join(__dirname, `..`, `resources/`)}`,
    RESOURCES_PUBLIC_DIRECTORY: `${path.join(__dirname, `..`, `resources/`, `public/`)}`,
    RESOURCES_STATIC_DIRECTORY: `${path.join(__dirname, `..`, `resources/`, `static/`)}`,
    REVIEWS_CHANNEL: parseSlackChannel(configuration.REVIEWS_CHANNEL),
    S3_BUCKET_ID: configuration.S3_BUCKET_ID,
    SIGNING_SECRET: configuration.SIGNING_SECRET,
    SIMPLE_MODE: configuration.SIMPLE_MODE,
    SLACK_SIGNING_SECRET: configuration.SLACK_SIGNING_SECRET,
    SLACK_TOKEN: configuration.SLACK_TOKEN,
    TEAMS_CHANNEL: parseSlackChannel(configuration.TEAMS_CHANNEL),
    TESTS_CHANNEL: parseSlackChannel(configuration.TESTS_CHANNEL),
    TRANSLATION_METHOD: `gtx`, // Can be either 't' or 'gtx'
    USE_AMAZON_S3_TO_STORE_DATABASES: configuration.USE_AMAZON_S3_TO_STORE_DATABASES || false,
    USE_GOOGLE_TO_GENERATE_QR: configuration.USE_GOOGLE_TO_GENERATE_QR,
    USE_MACHINE_LEARNING: configuration.USE_MACHINE_LEARNING,
    USE_PLAY_STORE_OAUTH_TO_FETCH_REVIEWS: configuration.USE_PLAY_STORE_OAUTH_TO_FETCH_REVIEWS
}
