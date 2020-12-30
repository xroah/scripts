import {program} from "commander"
import {merge} from "webpack-merge"
import devConf from "../../config/webpack/webpack.dev"
import path from 'path'
import {start as startDevServer} from "webpack-build-helper"
import HTMLWebpackPlugin from "html-webpack-plugin"
import devServerConf from "../../config/webpack/server.config"
import fs from "fs"

const start = program.command("start")
const cwd = process.cwd()

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
    let mergedConfig = {...devConf}

    if (!ts) {
        mergedConfig.entry = "./src/index.jsx"
    }

    if (+port) {
        serverConf.port = port
    }

    serverConf.open = !!open

    if (config) {
        const customConfig = require(path.join(cwd, config))

        mergedConfig = merge(devConf, customConfig.webpack)

        mergedConfig.plugins!.push(
            new HTMLWebpackPlugin(new customConfig.webpack?.htmlWebpackPlugin)
        )

        serverConf = {
            ...serverConf,
            ...customConfig.webpack?.devServer
        }
    } else {
        mergedConfig.plugins?.push(new HTMLWebpackPlugin({
            template: "public/index.html"
        }))
    }
    fs.writeFileSync("cfg.json", JSON.stringify(mergedConfig, null, 4))
    fs.writeFileSync("scfg.json", JSON.stringify(serverConf, null, 4))
    startDevServer(mergedConfig, serverConf)
}

start
    .option("-p, --port [value]", "Specify a port")
    .option("-c, --config <value>", "Configuration file")
    .option("--no-ts", "Use javascript")
    .option("-o, --open", "Open browser")
    .action(action)