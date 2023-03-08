import yargs from "yargs"
import rimraf from "rimraf"
import fs from "fs"
import getAbsPath from "../utils/get-abs-path.js"

export default function createRMCommand(y: typeof yargs) {
    return y.command(
        "rm <files...>",
        "Remove the files or directories",
        {
            verbose: {
                type: "boolean",
                desc: "Show details"
            }
        },
        argv => {
            const files = argv.files as string[]
            const filter = (f: string) => {
                if (argv.verbose) {
                    console.log(f)
                }

                return true
            }

            for (const f of files) {
                const absFilePath = getAbsPath(f)

                if (fs.existsSync(absFilePath)) {
                    rimraf.sync(absFilePath, { filter })
                }
            }
        }
    )
}