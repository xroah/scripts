const appendSpace = require("./appendSpace")

module.exports = function resizeString(str, length) {
    const l = str.length

    if (l > length) {
        return str.substring(0, length + 1)
    }

    const restLen = length - l

    return appendSpace(str, restLen)
}