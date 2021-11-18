import {transformFileSync} from "@babel/core"
import writeCodeToCache from "./write-code-to-cache.js"

export default function transformES(filename: string) {
    const ret = transformFileSync(filename, {
        presets: ["@babel/preset-env"]
    })
    
    return writeCodeToCache(ret!.code!)
}