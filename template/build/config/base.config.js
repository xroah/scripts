const path = require("path")
const HTMLWebpackPlugin = require("html-webpack-plugin")
//app.config.js: generated via cli
const config = require("./app.config.js")
const context = process.cwd()

module.exports = function getBaseConf() {
    const publicDir = path.join(context, "public")

    return {
        entry: config.appIndex,
        context,
        output: {
            path: path.join(context, "dist"),
            filename: "js/index.[contenthash].js",
            chunkFilename: "js/chunk.[contenthash].[id].js"
        },
        module: {
            rules: [{
                test: /\.(png|jpg|gif|svg)$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 8192
                    }
                }]
            }, {
                test: /\.(j|t)sx?$/,
                use: ["babel-loader"],
                exclude: /node_modules/
            }]
        },
        plugins: [
            new HTMLWebpackPlugin({
                template: path.join(publicDir, "index.html"),
                hash: true,
                favicon: path.join(publicDir, "favicon.ico")
            })
        ],
        resolve: {
            extensions: [".js", ".jsx", ...(config.typescript ? [".ts", ".tsx"] : [])]
        }
    }
}