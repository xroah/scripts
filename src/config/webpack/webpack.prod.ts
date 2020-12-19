import MiniCssExtractPlugin from "mini-css-extract-plugin"
import TerserWebpackPlugin from "terser-webpack-plugin"
import CSSMiniMinimizerPlugin from "css-minimizer-webpack-plugin"
import {Configuration} from "webpack"

const config: Configuration = {
    optimization: {
        minimizer: [
            new TerserWebpackPlugin({
                terserOptions: {
                    output: {
                        comments: false
                    }
                },
                extractComments: false,
            }),
            new CSSMiniMinimizerPlugin()
        ],
        splitChunks: {
            minSize: 150 * 1024,
            maxSize: 200 * 1024,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all"
                },
                commons: {
                    minChunks: 2,
                    name: "commons"
                }
            }
        }
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/style.[contenthash].css"
        }),
    ]
}

export default config