import MiniCssExtractPlugin from "mini-css-extract-plugin"
import TerserWebpackPlugin from "terser-webpack-plugin"
import CSSMinimizerPlugin from "css-minimizer-webpack-plugin"
import getBaseConf from "./webpack.base"
import {merge} from "webpack-merge"

export default () => merge(
    getBaseConf("production"),
    {
        optimization: {
            minimizer: [
                new TerserWebpackPlugin({
                    terserOptions: {
                        output: {
                            comments: false
                        }
                    },
                    extractComments: false
                }),
                new CSSMinimizerPlugin()
            ],
            splitChunks: {
                minSize: 100 * 1024,
                maxSize: 200 * 1024,
                cacheGroups: {
                    vendors: {
                        chunks: "all",
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                        reuseExistingChunk: true
                    },
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true
                    }
                }
            }
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "css/style.[contenthash].css"
            })
        ]
    }
)