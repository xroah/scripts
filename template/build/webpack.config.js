
const MiniCSSPlugin = require("mini-css-extract-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const OptimizeCSSPlugin = require("optimize-css-assets-webpack-plugin")
const webpack = require("webpack")
const getBaseConf = require("./base.config")
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const optimization = {
    minimizer: [
        new TerserPlugin({
            extractComments: false,
            terserOptions: {
                output: {
                    comments: false
                }
            }
        }),
        new OptimizeCSSPlugin()
    ],
    splitChunks: {
        chunks: "all",
        name: false
    }
}

module.exports = env => {
    const isProd = env === "production"
    const base = getBaseConf()
    base.mode = process.env.NODE_ENV = env
    base.module.rules.push({
        test: /\.css$/,
        use: [
            isProd ? MiniCSSPlugin.loader : "style-loader",
            "css-loader"
        ]
    })

    if (isProd) {
        base.plugins.push(
            new MiniCSSPlugin({
                filename: "css/index.[hash].css",
                chunkFilename: "css/chunk.[hash].[id].css"
            })
        )
        base.optimization = optimization
    } else {
        base.devtool = "eval-source-map"
        base.plugins.push(
            new webpack.HotModuleReplacementPlugin(),
            new ReactRefreshWebpackPlugin()
        )
    }

    return base
}