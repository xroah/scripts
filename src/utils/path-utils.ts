import {
    isAbsolute,
    join as joinPath,
    parse as parsePath
} from "path"
import { existsSync } from "fs"
import { fileURLToPath } from "url"

export function getAbsPath(file: string) {
    if (!file) {
        return ""
    }

    if (isAbsolute(file)) {
        return file
    }

    return joinPath(process.cwd(), file)
}

let root = ""

function isProjectRoot(filePath: string) {
    const PACKAGE_JSON = "package.json"

    return existsSync(joinPath(filePath, PACKAGE_JSON))
}

export function getRootDir() {
    if (root) {
        return root
    }

    const basePath = fileURLToPath(import.meta.url)
    let rootPath = basePath

    while (rootPath && rootPath !== "/") {
        if (isProjectRoot(rootPath)) {
            root = rootPath

            break
        }

        rootPath = parsePath(rootPath).dir
    }

    return root
}