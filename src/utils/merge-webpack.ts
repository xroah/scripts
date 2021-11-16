import defaultHTMLPluginOptions from ".././config/webpack/html-webpack-plugin.js"
import {merge} from "webpack-merge"
import {Configuration} from "webpack"
import HTMLWebpackPlugin from "html-webpack-plugin"
import loadConfig from "./load-config.js"
import getAbsPath from "./get-abs-path.js"

interface Options {
    configFile?: string
    ts?: boolean
    entry?: string
    index: string
}

export default (
    baseConf: Configuration,
    {
        configFile,
        ts,
        entry,
        index
    }: Options
) => {
    let noHTMLPlugin = false
    let htmlOptions = {...defaultHTMLPluginOptions}
    let devServer = {}
    let merged = {...baseConf}

    if (!ts) {
        merged.entry = getAbsPath("./src/index.jsx")
    }

    const customConfig = loadConfig(configFile)
    const htmlPluginOptions = customConfig.htmlWebpackPlugin || {}
    merged = merge(baseConf, customConfig.webpack || {})
    devServer = customConfig.devServer || {}

    // Do not need html-webpack-plugin
    if (htmlPluginOptions === false) {
        noHTMLPlugin = true
    } else {
        htmlOptions = {
            ...htmlOptions,
            ...htmlPluginOptions
        }
    }

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