const path = require("path")
const HTMLWebpackPlugin = require("html-webpack-plugin")

module.exports = function getBaseConf(typescript) {
    const context = path.resolve(__dirname, "..")
    const entry = typescript ? "src/index.tsx" : "src/index.jsx"
    const publicDir = path.join(context, "public")

    return {
        entry: path.join(context, entry),
        context,
        output: {
            path: path.join(context, "dist"),
            filename: "js/index.[hash].js",
            chunkFilename: "js/chunk.[hash].[id].js"
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
                test: typescript ? /\.(j|t)sx?$/ : /\.jsx?$/,
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
            extensions: [".js", ".jsx"].concat(typescript ? [".ts", ".tsx"] : []),
            alias: {
                "react-dom": "@hot-loader/react-dom"
            }
        }
    }
}