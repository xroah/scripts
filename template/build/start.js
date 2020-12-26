const devConf = require("./config/dev.config")
const serverConf = require("./config/server.config")
const builderHelper = require("webpack-build-helper")

builderHelper.start(devConf, serverConf)