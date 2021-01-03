const fs = require("fs")
const path = require("path")

function copyDir(source, dest) {
    const files = fs.readdirSync(source)

    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, {recursive: true})
    }

    while (files.length) {
        const file = files.pop()
        const filePath = path.join(source, file)
        const stat = fs.statSync(filePath)
        const newDest = path.join(dest, file)

        if (stat.isDirectory()) {
            copyDir(filePath, newDest)
        } else {
            fs.copyFileSync(filePath, newDest)
        }
    }
}

function copyFile(source, dest) {
    if (
        !fs.existsSync(dest) ||
        !fs.statSync(dest).isDirectory()
    ) {
        return fs.copyFileSync(source, dest)
    }
    //copy source file to the target directory
    const file = path.join(dest, path.parse(source).base)

    fs.copyFileSync(source, file)
}

module.exports = function copy(source, dest) {
    if (source && fs.existsSync(source)) {
        const stat = fs.statSync(source)
        const cp = stat.isDirectory() ? copyDir : copyFile

        cp(source, dest)
    }
}