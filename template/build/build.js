const prodConf = require("./config/prod.config")
const builderHelper = require("webpack-build-helper")
const rimraf = require("rimraf")

try {
    rimraf.sync(prodConf.output.path)
} catch (error) {
    console.log(error)
}

builderHelper.build(prodConf)