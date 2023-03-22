import path from "path"
import fs from "fs"
import { getAbsPath } from "./index.js"
import transpileTs from "./transpile-ts.js"

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

    if (configFile) {
        configFile = getAbsPath(configFile)
    }else if (fs.existsSync(defaultConfFileTS)) {
        configFile = defaultConfFileTS
    } else {
        for (const jsConfigFile of defaultJSConfigFiles) {
            if (fs.existsSync(jsConfigFile)) {
                configFile = jsConfigFile
                break
            }
        }
    }

    if (configFile) {
        const ts = path.extname(configFile) === ".ts"

        if (ts) {
            const m = await import(transpileTs(configFile))

            return m.default ?? m
        }

        return import(configFile)
    }

    return Promise.resolve({})
}