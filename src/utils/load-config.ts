import path from "path"
import fs from "fs"
import { getAbsPath } from "./index.js"
import transpileTs from "./transpile-ts.js"
import url from "url"

export default async function loadConfig(configFile?: string) {
    const DEFAULT_CONF_NAME = "r.config"
    const getDefaultJsFile = (ext: string) => {
        return getAbsPath(`${DEFAULT_CONF_NAME}.${ext}`)
    }
    const defaultJSConfigFiles = [
        getDefaultJsFile("js"),
        getDefaultJsFile("cjs"),
        getDefaultJsFile("mjs")
    ]
    const defaultConfFileTS = getAbsPath(`${DEFAULT_CONF_NAME}.ts`)
    let realConfigFile = ""

    if (configFile && fs.existsSync(configFile)) {
        realConfigFile = getAbsPath(configFile)
    }else if (fs.existsSync(defaultConfFileTS)) {
        realConfigFile = defaultConfFileTS
    } else {
        for (const jsConfigFile of defaultJSConfigFiles) {
            if (fs.existsSync(jsConfigFile)) {
                realConfigFile = jsConfigFile
                break
            }
        }
    }

    if (realConfigFile) {
        const ts = path.extname(realConfigFile) === ".ts"
        let modulePath = realConfigFile

        if (ts) {
            modulePath = transpileTs(realConfigFile)
        }

        return import(url.pathToFileURL(modulePath).href)
    }

    return Promise.resolve({})
}