
import { join as joinPath } from "node:path"
import fg from "fast-glob"
import {
    existsSync,
    readdirSync,
    rmdirSync,
    statSync,
    unlinkSync
} from "node:fs"
import { getAbsPath } from "./path-utils.js"

type Filter = (f: string) => boolean

function glob(pattern: string) {
    return fg.sync(
        pattern,
        {
            onlyFiles: false,
            dot: true,
            absolute: true
        }
    )
}

function rmFilesByGlob(files: string[], filter: Filter) {
    const dirs: string[] = []

    for (const f of files) {
        const stat = statSync(f)

        if (!filter(f)) {
            continue
        }

        // remove matched files first
        if (stat.isDirectory()) {
            dirs.push(f)
        } else {
            unlinkSync(f)
        }
    }

    for (const d of dirs) {
        if (!filter(d)) {
            continue
        }

        rmdirSync(d)
    }
}

function _rm(file: string, filter: Filter) {
    const newFilePath = file.replace(/\\+/g, "/")

    if (fg.isDynamicPattern(newFilePath)) {
        return rmFilesByGlob(glob(newFilePath), filter)
    }

    const absFilePath = getAbsPath(file)

    if (!existsSync(absFilePath)) {
        return
    }

    const rmDirOrFiles = (filePath: string) => {
        const stat = statSync(filePath)

        if (!filter(filePath)) {
            return
        }

        if (stat.isDirectory()) {
            let files: string[] = []

            files = readdirSync(filePath)

            for (const f of files) {
                rmDirOrFiles(joinPath(filePath, f))
            }

            rmdirSync(filePath)
        } else {
            unlinkSync(filePath)
        }
    }

    rmDirOrFiles(absFilePath)
}

export default function rm(
    files: string | string[],
    filter: Filter = () => true
) {
    if (Array.isArray(files)) {
        for (const f of files) {
            _rm(f, filter)
        }
    } else {
        _rm(files, filter)
    }
}