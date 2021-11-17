import ts from "typescript";
import fs from "fs"
import path from "path"
import getAbsPath from "./get-abs-path.js";
import getProjectRoot from "./get-project-root.js";


export default (filename: string) => {
    const cacheDir = path.join(getProjectRoot(), ".cache")
    const source = fs.readFileSync(getAbsPath(filename)).toString()
    const {name} = path.parse(filename)
    const outputFilename = path.join(cacheDir, `${name}.cjs`)
    const result = ts.transpileModule(
        source,
        {
            compilerOptions: {
                module: ts.ModuleKind.CommonJS
            }
        }
    );

    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir)
    }

    fs.writeFileSync(outputFilename, result.outputText.toString())

    process.nextTick(() => {
        try {
            fs.unlinkSync(outputFilename)
        } catch (error) {
            // do nothing
        }
    })

    return outputFilename
}