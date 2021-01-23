"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const open_1 = __importDefault(require("open"));
const chalk_1 = __importDefault(require("chalk"));
const webpack_1 = __importDefault(require("webpack"));
const webpack_dev_server_1 = __importDefault(require("webpack-dev-server"));
const check_port_1 = __importDefault(require("./utils/check-port"));
const clear_console_1 = __importDefault(require("./utils/clear-console"));
const get_ip_1 = __importDefault(require("./utils/get-ip"));
const pad_space_1 = __importDefault(require("./utils/pad-space"));
const resize_string_1 = __importDefault(require("./utils/resize-string"));
const get_current_time_1 = __importDefault(require("./utils/get-current-time"));
function isPlainObject(obj) {
    return !!obj && Object.prototype.toString.call(obj) === "[object Object]";
}
function handleOption(options) {
    const DEFAULT_PORT = 3000;
    const DEFAULT_HOST = "0.0.0.0";
    const _options = isPlainObject(options) ? options : {};
    _options.quiet = true;
    _options.host = options.host || DEFAULT_HOST;
    _options.port = options.port || DEFAULT_PORT;
    return _options;
}
function startDevServer(webpackConfig, options) {
    const { open: _open, port } = options;
    const protocol = options.https ? "https" : "http";
    options.open = false;
    const compiler = webpack_1.default(webpackConfig);
    const server = new webpack_dev_server_1.default(compiler, options);
    const events = ["SIGINT", "SIGTERM"];
    if (_open) {
        open_1.default(`${protocol}://localhost:${port}`);
    }
    compiler.hooks.compile.tap("compile", () => {
        clear_console_1.default();
        console.log(chalk_1.default.greenBright("Compiling"));
    });
    compiler.hooks.done.tap("done", stats => {
        const time = pad_space_1.default(get_current_time_1.default(), 5);
        const LABEL_LENGTH = 8;
        clear_console_1.default();
        if (stats.hasErrors()) {
            console.log(chalk_1.default.red("Failed to compile."));
            console.log(stats.toJson().errors.map((e) => e.stack).join("\n\n"));
        }
        else {
            console.log();
            console.log(time +
                chalk_1.default.green("Compiled successfully"));
            console.log();
            console.log("You can view the app in your browser: ");
            console.log();
            console.log(`${resize_string_1.default("Local:", LABEL_LENGTH)} `, chalk_1.default.bold(chalk_1.default.cyan(`${protocol}://localhost:${port}`)));
            console.log(`${resize_string_1.default("Network:", LABEL_LENGTH)} `, chalk_1.default.bold(chalk_1.default.cyan(`${protocol}://${get_ip_1.default()}:${port}`)));
            console.log();
            console.log("To create production bundle, run:", chalk_1.default.green("npm run build"));
        }
    });
    server.listen(port, options.host, err => {
        if (err) {
            throw err;
        }
        clear_console_1.default();
        console.log();
        console.log(chalk_1.default.greenBright("Starting dev server..."));
    });
    events.forEach(sig => {
        process.on(sig, () => {
            server.close();
            process.exit();
        });
    });
}
exports.default = (webpackConfig, devServerOptions) => {
    const options = handleOption(devServerOptions);
    const port = options.port;
    check_port_1.default(port, options.host, (err, availablePort) => {
        if (err) {
            throw err;
        }
        options.port = availablePort;
        if (port !== availablePort) {
            console.log(chalk_1.default.red(`The port ${port} is already in use`));
        }
        startDevServer(webpackConfig, options);
    });
};
