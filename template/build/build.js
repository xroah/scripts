const conf = require("./webpack.config")
const prodConf = conf("production")
const builderHelper = require("webpack-build-helper")

builderHelper.build(prodConf)