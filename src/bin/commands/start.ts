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
    let serverConf = {
        ...devServerConf
    }

    if (+port) {
        serverConf.port = port
    }

    serverConf.open = !!open

    const {
        merged,
        devServer
    } = merge(devConf, config, ts)

    startDevServer(
        merged,
        {
            ...serverConf,
            ...devServer
        }
    )
}

start
    .option("-p, --port [value]", "Specify a port")
    .option("-c, --config <value>", "Configuration file")
    .option("--no-ts", "Use javascript")
    .option("-o, --open", "Open browser")
    .action(action)