import path from "path"
import fs from "fs"
import url from "url"

export function isPlainObject(obj: unknown) {
    return !!obj &&
        Object.prototype.toString.call(obj) === "[object Object]"
}

export function getAbsPath(file: string) {
    if (!file) {
        return ""
    }

    if (path.isAbsolute(file)) {
        return file
    }

    return path.join(process.cwd(), file)
}

let root = ""

function isProjectRoot(filePath: string) {
    const PACKAGE_JSON = "package.json"

    return fs.existsSync(path.join(filePath, PACKAGE_JSON))
}

export function getRootDir() {
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