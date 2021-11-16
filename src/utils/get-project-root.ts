import path from "path"
import fs from "fs"

let root: string

const fileUrl = new URL(import.meta.url).pathname

export default (base: string = path.parse(fileUrl).dir) => {
    if (root) {
        return root
    }
    
    const rootDir = path.parse(base).root

    do {
        if (fs.existsSync(path.join(base, "package.json"))) {
            root = base

            break
        }

        base = path.parse(base).dir
    } while (base !== rootDir)

    return root
}
