import path from "path"
import fs from "fs"

export default (configFile: string) => {
    const cwd = process.cwd()
    const defaultConfFile = path.join(cwd, "reap-config.js")
    let config: any = {}

    if (configFile) {
        let absPath: string

        if (path.isAbsolute(configFile)) {
            absPath = configFile
        } else {
            absPath = path.join(cwd, configFile)
        }

        config = require(absPath)
    } else if (fs.existsSync(defaultConfFile)) {
        config = require(defaultConfFile)
    }

    return config
}