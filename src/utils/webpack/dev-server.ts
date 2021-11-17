import WebpackDevServer from "webpack-dev-server";

export default class DevServer extends WebpackDevServer {
    // overwrite log status, suppress log info
    logStatus() {
        console.log("lllllllllllllllllllllllll")
    }
}