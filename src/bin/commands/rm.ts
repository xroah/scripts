import {program} from "commander"
import rimraf from "rimraf"

program
    .command("rm <files...>")
    .action((files: string[]) => {
        try {
            files.forEach(file => rimraf.sync(file))
        } catch (error) {
            console.log(error)
        }
    })