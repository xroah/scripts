
const MiniCSSPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSPlugin = require("optimize-css-assets-webpack-plugin");
const fs = require("fs");
const getBaseConf = require("./baseConf");

const optimization = {
    minimizer: [
        new TerserPlugin({
            extractComments: false,
            terserOptions: {
                output: {
                    comments: false
                }
            }
        }),
        new OptimizeCSSPlugin()
    ]
}

module.exports = env => {
    const isProd = env === "production";
    const useTypescript = fs.existsSync("../tsconfig.json");
    const base = getBaseConf(useTypescript);
    process.env.NODE_ENV = env;
    base.module.rules.push({
        test: /\.css$/,
        use: [
            isProd ? MiniCSSPlugin.loader : "style-loader",
            "css-loader"
        ]
    });

    if (isProd) {
        base.plugins.push(
            new MiniCSSPlugin({
                filename: "index.css",
                chunkFilename: "chunk.[name].[id].css"
            })
        );
        base.optimization = optimization;
    }

    return base;
}