module.exports = function appendSpace(str, spaceNum) {
    return `${str}${Array(spaceNum).fill(" ").join("")}`
}