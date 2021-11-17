import path from "path"
import fs from "fs"
import url from "url"

let root: string

const fileUrl = url.fileURLToPath(import.meta.url)

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
