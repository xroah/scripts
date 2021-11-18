import {merge} from "webpack-merge"
import HTMLWebpackPlugin from "html-webpack-plugin"
import getBaseConf from "../../config/webpack/webpack.base.js"
import defaultHTMLPluginOptions from "../../config/webpack/html-webpack-plugin.js"
import loadConfig from "../load-config.js"
import getAbsPath from "../get-abs-path.js"
import devConf from "../../config/webpack/webpack.dev.js"
import prodConf from "../../config/webpack/webpack.prod.js"

interface Options {
    configFile?: string
    ts?: boolean
    entry?: string
    index: string,
    dev?: boolean
    args?: any
}

async function handleConfig(config: any, args?: any): Promise<any> {
    if (typeof config === "function") {
        return handleConfig(config(args), args)
    } else if (config instanceof Promise) {
        const ret = await config

        return handleConfig(ret, args)
    }

    return config
}

export default async (
    {
        configFile,
        ts,
        entry,
        index,
        dev,
        args
    }: Options
) => {
    const customConfig = await handleConfig(loadConfig(configFile), args)
    let htmlOptions = {...defaultHTMLPluginOptions}
    let devServer = {}
    let baseConf = getBaseConf(
        dev ? "development" : "production",
        {
            babel: customConfig.babel
        }
    )

    if (!ts) {
        baseConf.entry = getAbsPath("./src/index.jsx")
    }

    const htmlPluginOptions = customConfig.htmlWebpackPlugin || {}
    const merged = merge(
        baseConf,
        dev ? devConf : prodConf,
        customConfig.webpack || {}
    )
    devServer = customConfig.devServer || {}

    // Do not need html-webpack-plugin
    if (htmlPluginOptions !== false) {
        htmlOptions = {
            ...htmlOptions,
            ...htmlPluginOptions
        }

        if (index) {
            htmlOptions.template = getAbsPath(index)
        }

        merged.plugins!.push(
            new HTMLWebpackPlugin(htmlOptions as any)
        )
    }

    if (entry) {
        merged.entry = getAbsPath(entry)
    }

    return {
        merged,
        devServer
    }
}