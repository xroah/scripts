export default () => {
    const env = process.env.BABEL_ENV
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
        ].filter(Boolean),
        plugins: [
            require.resolve("@babel/plugin-transform-runtime"),
            require.resolve("@babel/plugin-proposal-class-properties"),
            env === "development" && require.resolve("react-refresh/babel")
        ].filter(Boolean)
    }

    return config
}