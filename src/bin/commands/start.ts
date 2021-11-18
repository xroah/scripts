import {program} from "commander"
import startDevServer from "../../utils/webpack/start.js"
import devServerConf from "../../config/webpack/server.config.js"
import merge from "../../utils/webpack/merge.js"
import setEnv from "../../utils/set-env.js"
import {NAME} from "../../utils/constants.js"

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
    .name(NAME)
    .command("start")
    .option("-p, --port [port]", "Specify a port")
    .option("-c, --config <file>", "Configuration file")
    .option("--no-ts", "Use javascript")
    .option("-o, --open", "Open browser")
    .option("-e, --entry <entry>", "Entry file, default src/index.[jt]sx")
    .option("--index <index>", "index.html file, default public/index.html")
    .action(action)
    .parse()