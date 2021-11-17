import {createRequire} from "module"
import path from "path"
import getProjectRoot from "./get-project-root.js"

const require = createRequire(path.join(getProjectRoot(), "package.json"))

export default function resolve(moduleName: string) {
    return require.resolve(moduleName)
}