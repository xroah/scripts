const MiniCSSPlugin = require("mini-css-extract-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const CSSMinimizerPlugin = require("css-minimizer-webpack-plugin")
const baseConf = require("./base.config")()

process.env.NODE_ENV = "production"

baseConf.optimization = {
    minimizer: [
        new TerserPlugin({
            extractComments: false,
            terserOptions: {
                output: {
                    comments: false
                }
            }
        }),
        new CSSMinimizerPlugin()
    ],
    splitChunks: {
        chunks: "all",
        name: false
    }
}

baseConf.module.rules.push({
    test: /\.css$/,
    use: [
        MiniCSSPlugin.loader,
        "css-loader"
    ]
})
baseConf.plugins.push(
    new MiniCSSPlugin({
        filename: "css/index.[contenthash].css",
        chunkFilename: "css/chunk.[contenthash].css"
    })
)

module.exports = {
    ...baseConf,
    mode: "production"
}