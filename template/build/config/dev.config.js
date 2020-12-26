
const webpack = require("webpack")
const baseConf = require("./base.config")()
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

process.env.NODE_ENV = "development"

baseConf.module.rules.push({
    test: /\.css$/,
    use: [
        "style-loader",
        "css-loader"
    ]
})
baseConf.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin()
)


module.exports = {
    ...baseConf,
    mode: "development",
    devtool: "eval-source-map"
}