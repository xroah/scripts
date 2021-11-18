import {Configuration} from "webpack"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import getBabelConf from "../babel/babel.config.js"
import getAbsPath from "../../utils/get-abs-path.js"
import resolve from "../../utils/resolve.js"

interface Options {
    babel?: object
}

export default (mode: "production" | "development", option: Options) => {
    const cwd = process.cwd()
    const isDev = mode === "development"
    const config: Configuration = {
        mode,
        entry: getAbsPath("src/index.tsx"),
        context: cwd,
        output: {
            filename: "js/main.[contenthash].js",
            chunkFilename: "js/chunk.[contenthash].js",
            path: getAbsPath("dist")
        },
        resolve: {
            extensions: [".js", ".ts", ".jsx", ".tsx"]
        },
        module: {
            rules: [{
                test: /\.[jt]sx?$/,
                exclude: /node_modules/,
                use: {
                    loader: resolve("babel-loader"),
                    options: getBabelConf(option.babel)
                }
            }, {
                test: /\.(png|jpe?g|gif|svg|bmp|webp)$/i,
                use: [
                    {
                        loader: resolve("url-loader"),
                        options: {
                            limit: 8192
                        }
                    }
                ]
            }, {
                test: /\.s?css$/,
                use: [
                    isDev ? resolve("style-loader") : MiniCssExtractPlugin.loader,
                    resolve("css-loader"),
                    resolve("sass-loader")
                ]
            }]
        }
    }

    return config
}