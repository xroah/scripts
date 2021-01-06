import path from "path"
import fs from "fs"
import getAbsPath from "./get-abs-path"

export default (configFile: string) => {
    const defaultConfFile = path.join(process.cwd(), "reap.config.js")
    let config: any = {}

    if (configFile) {
        config = require(getAbsPath(configFile))
    } else if (fs.existsSync(defaultConfFile)) {
        config = require(defaultConfFile)
    }

    return config
}