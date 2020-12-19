import webpack from "webpack"
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin"
import devServerConf from "./server.config"

const config: webpack.Configuration = {
    plugins: [
        new ReactRefreshWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin
    ],
    devtool: "eval-source-map",
    devServer: devServerConf
}

export default config