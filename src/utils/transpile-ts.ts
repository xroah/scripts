import ts from "typescript"
import fs from "fs"
import getAbsPath from "./get-abs-path.js"
import writeCodeToCache from "./write-code-to-cache.js"

export default (filename: string) => {
    const source = fs.readFileSync(getAbsPath(filename)).toString()
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