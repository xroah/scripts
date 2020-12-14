import {Configuration as WebpackConf} from "webpack"
import {Configuration as DevServerConf} from "webpack-dev-server"

declare namespace WebpackBuilderHelper {
    function start(webpackConf: WebpackConf, devServerConf: DevServerConf): void
    function build(webpackConf: WebpackConf): void
}

export = WebpackBuilderHelper