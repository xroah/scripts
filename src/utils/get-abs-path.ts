import path from "path"

export default function getAbsPath(file: string) {
    if (!file) {
        return ""
    }

    if (path.isAbsolute(file)) {
        return file
    }

    return path.join(process.cwd(), file)
}