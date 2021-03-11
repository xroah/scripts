import defaultHTMLPluginOptions from "../config/webpack/html-webpack-plugin"
import {merge} from "webpack-merge"
import {Configuration} from "webpack"
import HTMLWebpackPlugin from "html-webpack-plugin"
import loadConfig from "./load-config"
import getAbsPath from "./get-abs-path"

export default (
    baseConf: Configuration,
    configFile: string,
    ts: boolean,
    entry: string,
    index: string
) => {
    let noHTMLPlugin = false
    let htmlOptions = {...defaultHTMLPluginOptions}
    let devServer = {}
    let merged = {...baseConf}

    if (!ts) {
        merged.entry = getAbsPath("./src/index.jsx")
    }

    const customConfig = loadConfig(configFile)
    const htmlPluginOptions = customConfig.htmlWebpackPlugin
    merged = merge(baseConf, customConfig.webpack)

    // Do not need html-webpack-plugin
    if (htmlPluginOptions === false) {
        noHTMLPlugin = true
    } else {
        htmlOptions = {
            ...htmlOptions,
            ...htmlPluginOptions
        }
    }

    devServer = customConfig.devServer || {}

    if (entry) {
        merged.entry = getAbsPath(entry)
    }

    if (!noHTMLPlugin) {
        if (index) {
            htmlOptions.template = getAbsPath(index)
        }

        merged.plugins!.push(new HTMLWebpackPlugin(htmlOptions))
    }

    return {
        merged,
        devServer
    }
}