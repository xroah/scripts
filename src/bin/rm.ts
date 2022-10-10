import yargs from "yargs"
import rimraf from "rimraf"
import path from "path"

function rm(file: string) {
    if (path.isAbsolute(file)) {
        rimraf.sync(file)
    } else {
        rimraf.sync(path.join(process.cwd(), file))
    }
}

export default function createRMCommand(y: typeof yargs) {
    return y.command(
        "rm <files...>",
        "Remove the files or directories",
        {},
        argv => {
            const files = argv.files as string[]

            for (let f of files) {
                rm(f)
            }
        }
    )
}