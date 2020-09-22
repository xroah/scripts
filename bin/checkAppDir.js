const fs = require("fs")
const path = require("path")

module.exports = function checkAppDir(appName) {
    const cwd = process.cwd()
    const appDir = path.join(cwd, appName)

    if (!fs.existsSync(appDir)) {
        fs.mkdirSync(appDir)
    } else {
        const files = fs.readdirSync(appDir)
        
        if (!files.length) {
            throw new Error(
                `The ${appName} is not empty, please try another.`
            )
        }
    }

    return appDir
}