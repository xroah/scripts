import path from "path"
import fs from "fs"
import {getAbsPath} from "."
import transpileTs, { cacheDir } from "./transpile-ts.js"
import { createRequire } from "module"

const require = createRequire(path.join(cacheDir, "a.js"))

function handleRequire(configFile: string, ts: boolean) {
    const absFile = getAbsPath(configFile)
    const filename = ts ? transpileTs(configFile) : absFile
    const module = `./${path.parse(filename).base}`
    const config = require(module) || {}

    return config.default ? config.default : config
}

export default function loadConfig(configFile?: string) {
    const DEFAULT_CONF_NAME = "reap.config"
    const defaultConfFileJS = getAbsPath(`${DEFAULT_CONF_NAME}.js`)
    const defaultConfFileTS = getAbsPath(`${DEFAULT_CONF_NAME}.ts`)
    const pkgJSON = getAbsPath("package.json")
    let config: unknown = {}

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