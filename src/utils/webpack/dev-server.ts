import WebpackDevServer from "webpack-dev-server";

export default class DevServer extends WebpackDevServer {
    logStatus() {
        // overwrite logStatus, suppress log info
    }
}