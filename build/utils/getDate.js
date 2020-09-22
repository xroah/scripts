module.exports = function getDate() {
    const date = new Date()
    const convert = num => (100 + num).toString().substring(1)
    const map = {
        Y: date.getFullYear(),
        M: date.getMonth() + 1,
        D: date.getDate(),
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds()
    }

    return "Y-M-D h:m:s".replace(
        /(Y+)|(M+)|(D+)|(h+)|(m+)|(s+)/g,
        k => k === "Y" ? map[k].toString() : convert(map[k])
    )
}