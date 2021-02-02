export default (defaultConfig: any, customConfig: any) => {
    if (!customConfig) {
        return defaultConfig
    }

    const {
        merge,
        ...restConfig
    } = customConfig

    if (merge === false) {
        return restConfig
    }

    const ret = {
        ...restConfig,
        ...defaultConfig
    }
    ret.presets = defaultConfig.presets.concat(restConfig.presets || [])
    ret.plugins = defaultConfig.plugins.concat(restConfig.plugins || [])

    if (restConfig.runtime !== false) {
        ret.plugins.push(require.resolve("@babel/plugin-transform-runtime"))
    }

    return ret
}