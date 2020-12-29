import webpack from "webpack"
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin"
import HTMLWebpackPlugin from "html-webpack-plugin"
import {merge} from "webpack-merge"
import getBaseConf from "./webpack.base"
import devServerConf from "./server.config"

export default merge(
    getBaseConf("development"),
    {
        plugins: [
            new HTMLWebpackPlugin(),
            new ReactRefreshWebpackPlugin(),
            new webpack.HotModuleReplacementPlugin()
        ],
        devtool: "eval-source-map",
        devServer: devServerConf
    }
)