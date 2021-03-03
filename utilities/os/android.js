const FALLBACK = {
    api: 27,
    name: 'André Carvalho',
    version: '27'
}

const VERSIONS = [
    {name: 'Bender', version: '1.0'},
    {name: 'Bender', version: '1.1'},
    {name: 'Cupcake', version: '1.5'},
    {name: 'Donut', version: '1.6'},
    {name: 'Eclair', version: '2.0'},
    {name: 'Eclair', version: '2.0'},
    {name: 'Eclair', version: '2.1'},
    {name: 'Froyo', version: '2.2'},
    {name: 'Gingerbread', version: '2.3'},
    {name: 'Gingerbread', version: '2.3'},
    {name: 'Honeycomb', version: '3.0'},
    {name: 'Honeycomb', version: '3.1'},
    {name: 'Honeycomb', version: '3.2'},
    {name: 'Ice Cream Sandwich', version: '4.0'},
    {name: 'Ice Cream Sandwich', version: '4.0'},
    {name: 'Jelly Bean', version: '4.1'},
    {name: 'Jelly Bean', version: '4.2'},
    {name: 'Jelly Bean', version: '4.3'},
    {name: 'KitKat', version: '4.4'},
    {name: 'KitKat Watch', version: '4.4W.2'},
    {name: 'Lollipop', version: '5.0'},
    {name: 'Lollipop', version: '5.1'},
    {name: 'Marshmallow', version: '6.0'},
    {name: 'Nougat', version: '7.0'},
    {name: 'Nougat', version: '7.1'},
    {name: 'Oreo', version: '8.0.0'},
    {name: 'Oreo', version: '8.1.0'},
    {name: 'P', version: '9'},
    {name: 'Q', version: '10'},
    {name: 'R', version: '11'},
    {name: 'S', version: '12'}
]

module.exports = {
    version: function (sdk) {
        if (sdk === undefined) return FALLBACK

        const position = parseInt(sdk) - 1

        if (VERSIONS.length <= position) {
            return FALLBACK
        }

        return {
            api: sdk,
            name: VERSIONS[position].name,
            version: VERSIONS[position].version
        }
    }
}
