import path from "path"
import fs from "fs"
import getAbsPath from "./get-abs-path.js"
import transpileTs from "./transpile-ts.js"
import {createRequire} from "module"

function handleRequireTS(configFile: string) {
    const filename = transpileTs(configFile)
    const require = createRequire(filename)
    const module = `./${path.parse(filename).base}`
    const config = require(module) || {}

    return config.default ? config.default : config
}

export default (configFile?: string) => {
    const DEFAULT_CONF_NAME = "reap.config"
    const defaultConfFileJS = getAbsPath(`${DEFAULT_CONF_NAME}.js`)
    const defaultConfFileTS = getAbsPath(`${DEFAULT_CONF_NAME}.ts`)
    const pkgJSON = getAbsPath("package.json")
    const require = createRequire(pkgJSON)
    let config: any = {}

    if (configFile) {
        configFile = getAbsPath(configFile)

        if (path.extname(configFile) === ".ts") {
            config = handleRequireTS(configFile)
        } else {
            config = require(configFile)
        }
    } else if (fs.existsSync(defaultConfFileJS)) {
        config = require(defaultConfFileJS)
    } else if (fs.existsSync(defaultConfFileTS)) {
        config = handleRequireTS(defaultConfFileTS)
    } else if (fs.existsSync(pkgJSON)) {
        config = require(pkgJSON).reap
    }

    return config || {}
}