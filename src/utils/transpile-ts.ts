import {transpileModule, ModuleKind} from "typescript";
import fs from "fs"
import path from "path"
import getAbsPath from "./get-abs-path";
import getProjectRoot from "./get-project-root";

export default (filename: string) => {
    const cacheDir = path.join(getProjectRoot(), ".reap-cache")
    const source = fs.readFileSync(getAbsPath(filename)).toString()
    const {name} = path.parse(filename)
    const outputFilename = path.join(cacheDir, `${name}.js`)
    const result = transpileModule(source, {compilerOptions: {module: ModuleKind.CommonJS}});

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