const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = function getBaseConf(typescript) {
    const babelConf = {
        presets: [
            "@babel/preset-env",
            "@babel/preset-react"
        ],
        plugins: [
            "react-hot-loader/babel",
            "@babel/plugin-transform-runtime",
            "@babel/plugin-proposal-class-properties"
        ]
    };
    let test = /\.jsx?$/;

    if (typescript) {
        babelConf.presets.push("@babel/preset-typescript");
        test = /\.(j|t)sx?$/;
    }

    const babelLoaderConf = {
        test,
        use: [{
            loader: "babel-loader",
            options: _babelConf
        }]
    }

    return {
        entry: typescript ? "../src/index.tsx" : "../src/index.jsx",
        output: {
            path: path.resolve(__dirname, "..", "dist"),
            filename: "index.js",
            chunkFilename: "chunk.[name].[id].js"
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
            },
                babelLoaderConf
            ]
        },
        plugins: [
            new HTMLWebpackPlugin({
                template: "./public/index.html",
                hash: true,
            })
        ],
        resolve: {
            extensions: [".js", ".jsx"].concat(typescript ? [".ts", ".tsx"] : [])
        }
    };
}