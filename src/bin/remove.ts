import yargs from "yargs"
import rmFiles from "../utils/rm.js"

export default function createRMCommand(y: typeof yargs) {
    return y.command(
        ["remove <files...>", "rm"],
        "Remove the files or directories",
        {
            verbose: {
                alias: "V",
                type: "boolean",
                desc: "Show details"
            }
        },
        argv => {
            const files = argv.files as string[]
            const filter = argv.verbose ? (f: string) => {
                console.log(f)

                return true
            } : undefined

            rmFiles(files, filter)
        }
    )
}