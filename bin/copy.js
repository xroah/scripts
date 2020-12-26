const fs = require("fs")
const path = require("path")

function copyFileSync(src, dest) {
    fs.copyFileSync(src, dest)
}

function copyDir(source, target) {
    const files = fs.readdirSync(source)

    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, {recursive: true})
    }

    while (files.length) {
        const file = files.pop()
        const filePath = path.join(source, file)
        const stat = fs.statSync(filePath)
        const dest = path.join(target, file)

        if (stat.isDirectory()) {
            copyDir(filePath, dest)
        } else {
            copyFileSync(filePath, dest)
        }
    }
}

function copyFile(source, target) {

    if (
        !fs.existsSync(target) ||
        !fs.statSync(target).isDirectory()
    ) {
        return copyFileSync(source, target)
    }
    //copy source file to the target directory
    const srcObj = path.parse(source)
    const file = path.join(target, srcObj.base)

    copyFileSync(source, file)
}

module.exports = function copy(source, target) {
    if (source && fs.existsSync(source)) {
        const stat = fs.statSync(source)
        const cp = stat.isDirectory() ? copyDir : copyFile

        cp(source, target)
    }
}