import ts from "typescript"
import { join as joinPath } from "path"
import {
    readFileSync,
    existsSync,
    mkdirSync,
    writeFileSync,
    unlinkSync
} from "fs"

export const cacheDir = joinPath(
    process.cwd(),
    "node_modules/.r-cache"
)

let uuid = 0

function genFilename() {
    const PREFIX = "r-scripts"

    return `${PREFIX}${Date.now()}${uuid++}`
}

function writeCodeToCache(code: string) {
    const filename = joinPath(cacheDir, `${genFilename()}.mjs`)

    if (!existsSync(cacheDir)) {
        mkdirSync(cacheDir, { recursive: true })
    }

    writeFileSync(filename, code)

    process.nextTick(
        () => {
            try {
                unlinkSync(filename)
            } catch (error) {
                // do nothing
            }
        }
    )

    return filename
}

export default function transpireTS(filename: string) {
    const source = readFileSync(filename).toString()
    const result = ts.transpileModule(
        source,
        {
            compilerOptions: {
                module: ts.ModuleKind.ES2015
            }
        }
    )

    return writeCodeToCache(result.outputText.toString())
}