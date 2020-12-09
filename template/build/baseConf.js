const path = require("path")
const HTMLWebpackPlugin = require("html-webpack-plugin")
//config.js: generated via cli
const config = require("./config");

module.exports = function getBaseConf() {
    const context = path.resolve(__dirname, "..")
    const publicDir = path.join(context, "public")

    return {
        entry: config.appIndex,
        context,
        output: {
            path: path.join(context, "dist"),
            filename: "js/index.[contenthash].js",
            chunkFilename: "js/chunk.[chunkhash].[id].js"
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
                use: ["babel-loader"]
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