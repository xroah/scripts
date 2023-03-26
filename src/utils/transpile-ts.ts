import ts from "typescript"
import path from "path"
import fs from "fs"

export const cacheDir = path.join(
    process.cwd(),
    "node_modules/.r-cache"
)

let uuid = 0

function genFilename() {
    const PREFIX = "r-scripts"

    return `${PREFIX}${Date.now()}${uuid++}`
}

function writeCodeToCache(code: string) {
    const filename = path.join(cacheDir, `${genFilename()}.mjs`)

    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, {recursive: true})
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

export default function transpireTS(filename: string) {
    const source = fs.readFileSync(filename).toString()
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