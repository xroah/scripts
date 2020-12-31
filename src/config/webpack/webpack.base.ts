import {Configuration} from "webpack"
import path from "path"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import getBabelConf from "../babel/babel.config"

export default (mode: "production" | "development") => {
    process.env.NODE_ENV = mode
    const cwd = process.cwd()
    const isDev = mode === "development"
    const babelOptions = getBabelConf(isDev)
    const config: Configuration = {
        mode,
        entry: "./src/index.tsx",
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
                            limit: 8192,
                        },
                    },
                ],
            }, {
                test: /.scss$/,
                use: require.resolve("sass-loader")
            }, {
                test: /.css$/,
                use: [
                    isDev ? require.resolve("style-loader") : MiniCssExtractPlugin.loader,
                    require.resolve("css-loader")
                ]
            }]
        }
    }

    return config
}