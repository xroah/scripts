import rimraf from "rimraf"
import createProgram from "../../utils/create-program.js"

createProgram()
    .command("rm <paths...>")
    .action((paths: string[]) => {
        try {
            paths.forEach(p => rimraf.sync(p))
        } catch (error) {
            console.log(error)
        }
    })
    .parse()