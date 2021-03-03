const configuration = require('./../../../configuration/configurations.js')
const network = require('./../../../utilities/network/network.js')
const time = require('./../../../utilities/time/time.js')

const HALO_ENDPOINT = configuration.HALO_ENDPOINT
const HALO_USER = configuration.HALO_USER
const HALO_PASSWORD = configuration.HALO_PASSWORD

const GRANT_TYPE = `client_credentials`
const AUTHENTICATION_PATH = 'api/oauth/token#app'
const MODULES_ENDPOINT = 'api/generalcontent/instance/search'

const BRAND_NAME = 'Brand'
const BRAND_TAG_ID = '000000000000000000000002'
const BRAND_VALUE = 'KPN'

function authenticate() {
    return new Promise((res, rej) => {
        network.post({
            url: `${HALO_ENDPOINT}/${AUTHENTICATION_PATH}`,
            message: {
                grant_type: GRANT_TYPE,
                client_id: HALO_USER,
                client_secret: HALO_PASSWORD
            }
        })
            .then((data) => res(data.access_token))
            .catch(_ => rej(Error(`Failed to authenticate the user!`)))
    })
}

function data(token, time, modules) {
    return new Promise((res, rej) => {
        network.post({
            url: `${HALO_ENDPOINT}/${MODULES_ENDPOINT}`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            message: {
                include: ['all'],
                segmentTags: [
                    {
                        name: BRAND_NAME,
                        tagType: BRAND_TAG_ID,
                        value: BRAND_VALUE
                    }
                ],
                metaSearch: {
                    condition: 'and',
                    operands: [
                        {
                            condition: 'or',
                            operands: [
                                {
                                    operation: '=',
                                    property: 'removedAt',
                                    type: 'null',
                                    value: null
                                },
                                {
                                    operation: '>',
                                    property: 'removedAt',
                                    type: 'date',
                                    value: time
                                }
                            ]
                        },
                        {
                            operation: '=',
                            property: 'deletedAt',
                            type: 'null',
                            value: null
                        },
                        {
                            operation: '<=',
                            property: 'publishedAt',
                            type: 'date',
                            value: time
                        },
                        {
                            operation: '=',
                            property: 'archivedAt',
                            type: 'null',
                            value: null
                        }
                    ]
                },
                moduleNames: modules,
                pagination: {
                    limit: 10,
                    page: 1,
                    skip: true
                }
            }
        })
            .then((metadata) => res(metadata))
            .catch((err) => rej(err))
    })
}

module.exports = {
    modules: function (modules) {
        return new Promise((res, rej) => {
            authenticate()
                .then((token) => {
                    data(token, time.unix(), modules)
                        .then((data) => {
                            if (data.length === 0) {
                                rej(Error('No module found!'))
                            } else {
                                res(data)
                            }
                        })
                        .catch((err) => rej(err))
                })
                .catch((err) => rej(err))
        })
    }
}
