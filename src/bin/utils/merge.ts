import defaultHTMLPluginOptions from "../../config/webpack/html-webpack-plugin"
import {merge} from "webpack-merge"
import path from "path"
import {Configuration} from "webpack"
import HTMLWebpackPlugin from "html-webpack-plugin"
import loadConfig from "../utils/load-config"

export default (
    baseConf: Configuration,
    configFile: string,
    ts: boolean,
    entry: string,
    index: string
) => {
    let htmlOptions = {...defaultHTMLPluginOptions}
    let devServer = {}
    let merged = {...baseConf}
    const cwd = process.cwd()

    if (!ts) {
        merged.entry = path.join(cwd, "./src/index.jsx")
    }

    const customConfig = loadConfig(configFile)
    const htmlPluginOptions = customConfig.htmlWebpackPlugin || {}
    merged = merge(baseConf, customConfig.webpack)
    htmlOptions = {
        ...htmlOptions,
        ...htmlPluginOptions
    }

    devServer = customConfig.devServer || {}

    if (entry) {
        merged.entry = path.join(cwd, entry)
    }

    if (index) {
        htmlOptions.template = path.join(cwd, index)
    }

    merged.plugins!.push(new HTMLWebpackPlugin(htmlOptions))

    return {
        merged,
        devServer
    }
}