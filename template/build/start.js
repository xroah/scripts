const conf = require("./webpack.config")
const devConf = conf("development")
const serverConf = require("./server.config")
const builderHelper = require("webpack-build-helper")

builderHelper.start(devConf, serverConf)