import path from "path"
import fs from "fs"
import getAbsPath from "./get-abs-path"

export default (configFile?: string) => {
    const cwd = process.cwd()
    const defaultConfFile = path.join(cwd, "reap.config.js")
    const pkgJSON = path.join(cwd, "package.json")
    let config: any = {}

    if (configFile) {
        config = require(getAbsPath(configFile))
    } else if (fs.existsSync(defaultConfFile)) {
        config = require(defaultConfFile)
    } else if (fs.existsSync(pkgJSON)) {
        config = require(pkgJSON).reap || {}
    }

    return config
}