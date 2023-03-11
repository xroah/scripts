import ts from "typescript"
import fs from "fs"
import writeCodeToCache from "./write-code-to-cache.js"

export default function transpireTS(filename: string) {
    const source = fs.readFileSync(filename).toString()
    const result = ts.transpileModule(
        source,
        {
            compilerOptions: {
                module: ts.ModuleKind.CommonJS
            }
        }
    )

    return writeCodeToCache(result.outputText.toString())
}