import path from "path"
import fs from "fs"
import transpileTs from "./transpile-ts.js"
import url from "url"
import { getAbsPath } from "./path-utils.js"

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

        const m = await import(url.pathToFileURL(modulePath).href)

        return m.default ? m.default : m
    }

    return Promise.resolve({})
}