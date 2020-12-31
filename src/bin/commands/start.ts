import {program} from "commander"
import devConf from "../../config/webpack/webpack.dev"
import {start as startDevServer} from "webpack-build-helper"
import devServerConf from "../../config/webpack/server.config"
import merge from "../utils/merge"

const start = program.command("start")

function action(cmd: any) {
    const {
        config,
        port,
        open,
        ts
    } = cmd
    const {
        merged,
        devServer
    } = merge(devConf, config, ts)
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

    startDevServer(merged, serverConf)
}

start
    .option("-p, --port [value]", "Specify a port")
    .option("-c, --config <value>", "Configuration file")
    .option("--no-ts", "Use javascript")
    .option("-o, --open", "Open browser")
    .action(action)