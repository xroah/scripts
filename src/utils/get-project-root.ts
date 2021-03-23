import path from "path"
import fs from "fs"

let root: string

export default (base: string = __dirname) => {
    if (root) {
        return root
    }

    const PKG = "package.json"
    const rootDir = path.parse(base).root

    do {
        if (fs.existsSync(path.join(base, PKG))) {
            root = base

            break
        }

        base = path.parse(base).dir
    } while (base !== rootDir)

    return root
}
