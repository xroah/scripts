import path from "path"
import fs from "fs"
import getAbsPath from "./get-abs-path.js"
import transpileTs from "./transpile-ts.js"
import {createRequire} from "module"
import transformES from "./transform-es.js"
import {cacheDir} from "./constants.js"

const require = createRequire(path.join(cacheDir, "a.js"))

function handleRequire(configFile: string, ts: boolean) {
    const filename = (ts ? transpileTs : transformES)(configFile)
    const module = `./${path.parse(filename).base}`
    const config = require(module) || {}

    return config.default ? config.default : config
}

export default (configFile?: string) => {
    const DEFAULT_CONF_NAME = "reap.config"
    const defaultConfFileJS = getAbsPath(`${DEFAULT_CONF_NAME}.js`)
    const defaultConfFileTS = getAbsPath(`${DEFAULT_CONF_NAME}.ts`)
    const pkgJSON = getAbsPath("package.json")
    let config: any = {}

    if (configFile) {
        configFile = getAbsPath(configFile)
    } else if (fs.existsSync(defaultConfFileJS)) {
        configFile = defaultConfFileJS
    } else if (fs.existsSync(defaultConfFileTS)) {
        configFile = defaultConfFileTS
    } else if (fs.existsSync(pkgJSON)) {
        const jsonContent = JSON.parse(fs.readFileSync(pkgJSON).toString())
        config = jsonContent.reap
    }

    if (configFile) {
        const ts = path.extname(configFile) === ".ts"

        config = handleRequire(configFile, ts)
    }

    return config || {}
}