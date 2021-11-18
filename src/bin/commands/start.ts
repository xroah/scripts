import startDevServer from "../../utils/webpack/start.js"
import devServerConf from "../../config/webpack/server.config.js"
import merge from "../../utils/webpack/merge.js"
import setEnv from "../../utils/set-env.js"
import program from "./program.js"
import {
    config,
    entry,
    index,
    noTs
} from "./common-options.js"

async function action(cmd: any) {
    setEnv("development")

    const {
        config,
        port,
        open,
        ts,
        entry,
        index
    } = cmd
    const {
        merged,
        devServer
    } = await merge({
        configFile: config,
        ts,
        entry,
        index,
        dev: true,
        args: cmd
    })
    const serverConf = {
        ...devServerConf,
        ...devServer
    }
    const _port = +port

    if (_port) {
        serverConf.port = _port
    }

    if (open !== undefined) {
        serverConf.open = open
    }

    startDevServer(
        merged,
        {
            ...serverConf,
            hot: true
        }
    )
}

program
    .command("start")
    .option("-p, --port [port]", "Specify a port")
    .option(...config)
    .option(...noTs)
    .option("-o, --open", "Open browser")
    .option(...entry)
    .option(...index)
    .action(action)
    .parse()