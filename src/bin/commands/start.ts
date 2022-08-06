import setEnv from "../../utils/set-env.js"
import createProgram from "../../utils/create-program.js"
import {createServer} from "vite"
import {config} from "./common-options.js"

async function action(cmd: any) {
    setEnv("development")

    const {
        // config,
        port = 3000,
        open = true,
        root = process.cwd()
    } = cmd
    
    const server = await createServer({
        configFile: false,
        root,
        server: {
            port,
            open
        }
    })

    await server.listen()
    server.printUrls()
}

createProgram()
    .command("start")
    .option("-p, --port [port]", "Specify a port")
    .option("-r --root [dir]", "Root directory")
    .option(...config)
    .option("-o, --open", "Open browser")
    .action(action)
    .parse()