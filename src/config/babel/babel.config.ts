import resolve from "../../utils/resolve.js"
import loadConfig from "../../utils/load-config.js"

function handleBabelConf(config: any, env?: string) {
    const RUNTIME_PLUGIN = "@babel/plugin-transform-runtime"
    const REACT_REFRESH = "react-refresh/babel"
    const ret = {
        ...config
    } as any
    const presets = [
        [
            resolve("@babel/preset-env"),
            {
                modules: env === "test" ? "cjs" : false
            }
        ],
        resolve("@babel/preset-react"),
        resolve("@babel/preset-typescript")
    ]
    const plugins: string[] = [].concat(ret.plugins || [])
    ret.presets = presets.concat(ret.presets || [])

    if (config.runtime !== false && !plugins.includes(RUNTIME_PLUGIN)) {
        plugins.push(resolve(RUNTIME_PLUGIN))
    }

    if (env === "development" && plugins.includes(REACT_REFRESH)) {
        plugins.push(resolve(REACT_REFRESH))
    }

    ret.plugins = plugins

    return ret
}

export default () => {
    const env = process.env.BABEL_ENV || process.env.NODE_ENV
    const config = loadConfig().babel || {}
    const {
        merge,
        ...restConfig
    } = config

    if (merge === false) {
        return restConfig
    }

    return handleBabelConf(config, env)
}