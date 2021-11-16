import webpack from "webpack"
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin"
import {merge} from "webpack-merge"
import getBaseConf from "./webpack.base.js"

export default () => merge(
    getBaseConf("development"),
    {
        plugins: [
            new ReactRefreshWebpackPlugin(),
            new webpack.HotModuleReplacementPlugin()
        ],
        devtool: "eval-source-map"
    }
)