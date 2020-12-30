import defaultHTMLPluginOptions from "../../config/webpack/html-webpack-plugin"
import {merge} from "webpack-merge"
import path from "path"
import {Configuration} from "webpack"
import HTMLWebpackPlugin from "html-webpack-plugin"

export default function mergeConfig(baseConf: Configuration, configFile: string, ts: boolean) {
    let devServer = {}
    let merged = {...baseConf}

    if (!ts) {
        merged.entry = "./src/index.jsx"
    }

    if (configFile) {
        const customConfig = require(path.join(process.cwd(), configFile))
        const htmlPluginOptions = customConfig.htmlWebpackPlugin
        merged = merge(baseConf, customConfig.webpack)

        if (htmlPluginOptions !== false) {
            merged.plugins!.push(
                new HTMLWebpackPlugin(htmlPluginOptions || defaultHTMLPluginOptions)
            )
        }

        devServer = customConfig.devServer || {}
    } else {
        merged.plugins!.push(
            new HTMLWebpackPlugin(defaultHTMLPluginOptions)
        )
    }

    return {
        merged,
        devServer
    }
}