const devConf = require("./config/dev.config")
const serverConf = require("./config/server.config")
const builderHelper = require("webpack-build-helper")

process.env.NODE_ENV = "development"

builderHelper.start(devConf, serverConf)