import {program} from "commander"
import devConf from "../../config/webpack/webpack.dev"
import {start as startDevServer} from "webpack-build-helper"
import devServerConf from "../../config/webpack/server.config"
import merge from "../utils/merge-webpack"
import setEnv from "../utils/set-env"

function action(cmd: any) {
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
    } = merge(devConf, config, ts, entry, index)
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

    setEnv("development")
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
    .option("-c, --config <config>", "Configuration file")
    .option("--no-ts", "Use javascript")
    .option("-o, --open", "Open browser")
    .option("-e, --entry <entry>", "Entry file")
    .option("--index <index>", "index.html file")
    .action(action)