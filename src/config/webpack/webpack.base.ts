import {Configuration} from "webpack"
import path from "path"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import getBabelConf from "../babel/babel.config"

export default (mode: "production" | "development") => {
    const cwd = process.cwd()
    const isDev = mode === "development"
    const babelOptions = getBabelConf()
    const config: Configuration = {
        mode,
        entry: path.join(cwd, "./src/index.tsx"),
        context: cwd,
        output: {
            filename: "main.[contenthash].js",
            chunkFilename: "chunk.[contenthash].js",
            path: path.resolve(cwd, "dist")
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