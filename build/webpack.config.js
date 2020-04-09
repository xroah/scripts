
const MiniCSSPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSPlugin = require("optimize-css-assets-webpack-plugin");
const fs = require("fs");
const base = require("./baseConf");

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
    process.env.NODE_ENV = env;
}