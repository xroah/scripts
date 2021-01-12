import loadConfig from "../../bin/utils/load-config"
import mergeBabel from "../../bin/utils/merge-babel"

export default (runtime = true) => {
    const env = process.env.BABEL_ENV || process.env.NODE_ENV
    const customConfig = loadConfig().babel

    const config = {
        babelrc: false,
        configFile: false,
        presets: [
            [
                require.resolve("@babel/preset-env"),
                {
                    modules: env === "test" ? "cjs" : false
                }
            ],
            require.resolve("@babel/preset-react"),
            require.resolve("@babel/preset-typescript")
        ],
        plugins: [
            require.resolve("@babel/plugin-proposal-class-properties")
        ]
    }

    if (runtime) {
        config.plugins.push(require.resolve("@babel/plugin-transform-runtime"))
    }

    if (env === "development") {
        config.plugins.push(require.resolve("react-refresh/babel"))
    }

    return mergeBabel(config, customConfig)
}