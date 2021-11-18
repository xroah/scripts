import path from "path"
import fs from "fs"
import {cacheDir} from "./constants.js"

let uuid = 0

function genFilename() {
    const PREFIX = "reap-generated"

    return `${PREFIX}${Date.now()}${uuid++}`
}

export default function writeCodeToCache(code: string) {
    const filename = path.join(cacheDir, `${genFilename()}.cjs`)

    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir)
    }

    fs.writeFileSync(filename, code)

    process.nextTick(
        () => {
            try {
                fs.unlinkSync(filename)
            } catch (error) {
                // do nothing
            }
        }
    )

    return filename
}