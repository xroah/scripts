const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: ["react-hot-loader/patch", "./src/index.jsx"],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.js",
        chunkFilename: "[name].[id].js"
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [
                "style-loader",
                "css-loader"
            ]
        }, {
            test: /\.jsx?$/,
            use: "babel-loader"
        }, {
            test: /\.(png|jpg|gif|svg)$/,
            use: [{
                loader: "url-loader",
                options: {
                    limit: 8192
                }
            }]
        }]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: "./public/index.html",
            hash: true,
            title: "Custom React app"
        })
    ],
    resolve: {
        extensions: [".js", ".jsx"]
    },
    devServer: {
        contentBase: path.resolve(__dirname, "dist"),
        hot: true,
        open: true,
        historyApiFallback: true,
        host: "0.0.0.0",
        port: 8008
    }
};