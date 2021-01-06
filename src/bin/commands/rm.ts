import {program} from "commander"
import rimraf from "rimraf"

program
    .command("rm <paths...>")
    .action((paths: string[]) => {
        try {
            paths.forEach(p => rimraf.sync(p))
        } catch (error) {
            console.log(error)
        }
    })