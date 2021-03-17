const api = require('./routes/get/api.js')
const authentication = require('./authentication/authentication.js')
const bodyParser = require('body-parser')
const buildCommandsRoute = require('./routes/post/builds.js')
const commandsRoute = require('./routes/get/commands.js')
const commitGetRoute = require('./routes/get/commits.js')
const commitPostRoute = require('./routes/post/commits.js')
const configuration = require('./configuration/configurations.js')
const debugGetRoute = require('./routes/get/debug.js')
const debugPostRoute = require('./routes/post/debug.js')
const errorRoute = require('./routes/get/errors.js')
const express = require('express')
const gitlabCommandsRoute = require('./routes/post/gitlab.js')
const locationPostRoute = require('./routes/post/admin.js')
const location = require('./authentication/methods/ip.js')
const log = require('./utilities/debug/logger.js')
const requirements = require('./configuration/requirements.js')
const scheduler = require('./schedule/scheduler.js')
const shortenerRoute = require('./routes/get/shortener.js')
const slackCommandsRoute = require('./routes/post/command.js')
const versionRoute = require('./routes/get/version.js')

const TAG = 'index.js'

const ADMIN = authentication.ADMIN
const RESOURCES = authentication.RESOURCES
const SLACK = authentication.SLACK
const NONE = authentication.NONE

function verify(req, res, next, level, action) {
    authentication.verify(req, res, next, level, action)
}

requirements.initialize()
    .then(() => {
        const app = express()
        app.set('trust proxy', true)

        // Static resources
        app.use(express.static(configuration.RESOURCES_STATIC_DIRECTORY))

        if (!configuration.IS_PRODUCTION) {
            app.use(express.static(configuration.RESOURCES_PUBLIC_DIRECTORY, {index: false, extensions: ['html']}))
        }

        // Parsers
        app.use(bodyParser.json({
            limit: configuration.MAX_UPLOAD_SIZE,
            extended: true,
            verify: (req, res, buf) => {
                req.rawBody = buf.toString()
            }
        }))

        app.use(bodyParser.urlencoded({
            limit: configuration.MAX_UPLOAD_SIZE,
            extended: true,
            verify: (req, res, buf) => {
                req.rawBody = buf.toString()
            }
        }))

        // Non Authenticated Routes
        app.get('/:resource', [(req, res, next) => commandsRoute.handle(req, res, next)])

        app.get('/version/:dependency', [(req, res, next) => versionRoute.handle(req, res, next)])

        // Authentication
        app.use((req, res, next) => authentication.authenticate(req, res, next))

        // Authenticated Routes
        app.get('/:resource', [
            (req, res, next) => verify(req, res, next, ADMIN, debugGetRoute.handle),
            (req, res, next) => verify(req, res, next, NONE, shortenerRoute.handle),
            // (req, res, next) => verify(req, res, next, RESOURCES, shortenerRoute.handle),
            // (req, res, next) => shortenerRoute.handleWithoutAuthentication(req, res, next)
        ])

        app.get('/api/:type', [(req, res, next) => verify(req, res, next, RESOURCES, api.handle)])

        app.get('/commits/:platform/:branch', [(req, res, next) => verify(req, res, next, RESOURCES, commitGetRoute.handle)])

        app.post('/', [
            (req, res, next) => verify(req, res, next, RESOURCES, buildCommandsRoute.handle),
            (req, res, next) => verify(req, res, next, RESOURCES, commitPostRoute.handle),
            (req, res, next) => verify(req, res, next, ADMIN, debugPostRoute.handle),
            (req, res, next) => verify(req, res, next, RESOURCES, gitlabCommandsRoute.handle),
            (req, res, next) => verify(req, res, next, ADMIN, locationPostRoute.handle),
            (req, res, next) => verify(req, res, next, SLACK, slackCommandsRoute.handle)
        ])

        // Error handling
        app.use((req, res) => verify(req, res, () => {
            log.i(TAG, `Answering call (${req.method} '${req.originalUrl}' from ${location.ip(req)}) with authentication error`)
            res.status(403).json({title: "Oops...", description: "Authentication failed!"})
        }, RESOURCES, errorRoute.handle))

        // Initialize
        app.listen(configuration.PORT, () => {
            log.v(TAG, `Listening on port ${configuration.PORT}!`)
            scheduler.schedule()
        })
    })
    .catch((error) => log.e(TAG, error))
