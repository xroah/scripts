import {Configuration} from "webpack"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import getBabelConf from "../babel/babel.config"
import getAbsPath from "../../bin/utils/get-abs-path"

export default (mode: "production" | "development") => {
    const cwd = process.cwd()
    const isDev = mode === "development"
    const babelOptions = getBabelConf()
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
                    loader: require.resolve("babel-loader"),
                    options: babelOptions
                }
            }, {
                test: /\.(png|jpe?g|gif|svg|bmp|webp)$/i,
                use: [
                    {
                        loader: require.resolve("url-loader"),
                        options: {
                            limit: 8192
                        }
                    }
                ]
            }, {
                test: /\.s?css$/,
                use: [
                    isDev ? require.resolve("style-loader") : MiniCssExtractPlugin.loader,
                    require.resolve("css-loader"),
                    require.resolve("sass-loader")
                ]
            }]
        }
    }

    return config
}