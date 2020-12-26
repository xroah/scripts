const prodConf = require("./config/prod.config")
const builderHelper = require("webpack-build-helper")

builderHelper.build(prodConf)