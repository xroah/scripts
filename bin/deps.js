const deps = [
    "@babel/runtime",
    "react",
    "react-dom"
]
const devDeps = [
    "@babel/core",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-transform-runtime",
    "@babel/preset-env",
    "@babel/preset-react",
    "@pmmmwh/react-refresh-webpack-plugin",
    "babel-loader",
    "css-loader",
    "file-loader",
    "html-webpack-plugin",
    "mini-css-extract-plugin",
    "optimize-css-assets-webpack-plugin",
    "react-refresh",
    "style-loader",
    "terser-webpack-plugin",
    "url-loader",
    "webpack-build-helper"
]
const tsDeps = [
    "@babel/preset-typescript",
    "@types/react",
    "@types/react-dom",
    "typescript"
]

module.exports = {
    deps,
    devDeps,
    tsDeps
}