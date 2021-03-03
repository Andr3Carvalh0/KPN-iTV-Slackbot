module.exports = {
    output: function (array, maps, options) {
        const opt = options || {}
        let str = ""

        array.forEach(e => {
            str += `*${maps.name(e)}*${(opt.separator || " -")} ${maps.value(e)} ${(opt.suffix || "")}`

            if (maps.percentage !== undefined) {
                str += ` (${maps.percentage(e)})`
            }

            str += "\n"
        })

        return str
    }
}
