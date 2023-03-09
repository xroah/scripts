import path from "path"
import fs from "fs"
import url from "url"

let root = ""

function isProjectRoot(filePath: string) {
    const PACKAGE_JSON = "package.json"

    return fs.existsSync(path.join(filePath, PACKAGE_JSON))
}

export default function getRootDir() {
    if (root) {
        return root
    }

    const basePath = url.fileURLToPath(import.meta.url)
    let rootPath = path.parse(basePath).dir

    while (rootPath && rootPath !== "/") {
        if (isProjectRoot(rootPath)) {
            root = rootPath

            break
        }

        rootPath = path.parse(rootPath).dir
    }

    return root
}