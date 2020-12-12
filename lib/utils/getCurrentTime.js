module.exports = function getCurrentTime() {
    const date = new Date()
    const convert = num => (100 + num).toString().substring(1)
    const map = new Map([
        ["Y", date.getFullYear().toString()],
        ["M", date.getMonth() + 1],
        ["D", date.getDate()],
        ["h", date.getHours()],
        ["m", date.getMinutes()],
        ["s", date.getSeconds()]
    ])

    return "Y-M-D h:m:s".replace(
        /(Y)|(M)|(D)|(h)|(m)|(s)/g,
        k => k === "Y" ? map.get(k) : convert(map.get(k))
    )
}