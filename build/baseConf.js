const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const babelConf = require("./.babelrc.json");

module.exports = function getBaseConf(typescript) {
    let _babelConf = { ...babelConf };
    let test = /\.jsx?$/;

    if (typescript) {
        _babelConf.presets.push("@babel/preset-typescript");
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
            path: path.resolve(__dirname, "dist"),
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