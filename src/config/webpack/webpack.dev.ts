import webpack from "webpack"
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin"

export default {
    plugins: [
        new ReactRefreshWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    devtool: "eval-source-map"
}