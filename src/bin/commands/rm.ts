import {program} from "commander"
import rimraf from "rimraf"
import {NAME} from "../../utils/constants.js"

program
    .name(NAME)
    .command("rm <paths...>")
    .action((paths: string[]) => {
        try {
            paths.forEach(p => rimraf.sync(p))
        } catch (error) {
            console.log(error)
        }
    })
    .parse()