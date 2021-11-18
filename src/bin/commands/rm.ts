import rimraf from "rimraf"
import program from "./program.js"

program
    .command("rm <paths...>")
    .action((paths: string[]) => {
        try {
            paths.forEach(p => rimraf.sync(p))
        } catch (error) {
            console.log(error)
        }
    })
    .parse()