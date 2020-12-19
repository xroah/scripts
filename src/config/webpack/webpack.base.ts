import {Configuration} from "webpack"
import path from "path"
import MiniCssExtractPlugin from "mini-css-extract-plugin"

export default (mode: "production" | "development") => {
    const cwd = process.cwd()
    const isDev = mode === "development"
    const config: Configuration = {
        mode,
        entry: path.resolve(cwd, "src/index.tsx"),
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
                test: /\.j|tsx?$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        exclude: /node_modules/,
                        babelrc: false,
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react",
                            "@babel/preset-typescript",
                            isDev && "react-refresh/babel"
                        ].filter(Boolean),
                        plugins: ["@babel/plugin-transform-runtime"]
                    }
                }
            }, {
                test: /\.(png|jpe?g|gif|svg|bmp|webp)$/i,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 8192,
                        },
                    },
                ],
            }, {
                test: /.scss$/,
                use: "sass-loader"
            }, {
                test: /.css$/,
                use: [
                    isDev ? "style-loader" : MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            }]
        },
        plugins: []
    }

    return config
}