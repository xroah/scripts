import {transpileModule, ModuleKind} from "typescript";
import fs from "fs"
import path from "path"
import getAbsPath from "./get-abs-path";

const cacheDir = path.join(__dirname, "../../", ".cache")

if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir)
}

export default (filename: string) => {
    const source = fs.readFileSync(getAbsPath(filename)).toString()
    const {name} = path.parse(filename)
    const outputFilename = path.join(cacheDir, `${name}.js`)
    const result = transpileModule(source, {compilerOptions: {module: ModuleKind.CommonJS}});

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