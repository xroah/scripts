import yargs from "yargs"
import rimraf from "rimraf"
import fs from "fs"
import getAbsPath from "../utils/get-abs-path.js"

export default function createRMCommand(y: typeof yargs) {
    return y.command(
        "rm <files...>",
        "Remove the files or directories",
        {},
        argv => {
            const files = argv.files as string[]

            for (let f of files) {
                const absFilePath = getAbsPath(f)

                if (fs.existsSync(absFilePath)) {
                    rimraf.sync(absFilePath)
                }
            }
        }
    )
}