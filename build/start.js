const checkPort = require("./utils/checkPort");
const DevServer = require("webpack-dev-server");
const webpack = require("webpack");
const conf = require("./webpack.config");
const clearConsole = require("./utils/clearConsole");
const getDate = require("./utils/getDate");
const getIp = require("./utils/getIp");
const open = require("open");
const path = require("path");
const chalk = require("chalk");

const PORT = 8000;

function startDevServer(port, host) {
    const host = "0.0.0.0";
    const options = {
        contentBase: path.resolve("..", __dirname, "dist"),
        hot: true,
        compress: true,
        quiet: true,
        overlay: false,
        watchContentBase: true,
        historyApiFallback: true,
        host,
        port
    };
    const compiler = webpack(conf("development"));
    const server = new DevServer(compiler, options);

    compiler.hooks.done.tap("done", stats => {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(
            chalk.gray(getDate) + ":   " +
            chalk("Compiled successfully")
        );
    });

    server.listen(port, host, async err => {
        if (err) {
            throw err;
        }

        clearConsole();
        
        //port already in use
        if (port !== PORT) {
            console.log(chalk.red(`${port} already in use`));
        }

        await open(`http://localhost:${port}`);
        //print empty line
        console.log();
        console.log(`${chalk.bold("Local")}: localhost:${port}`);
        console.log(`${chalk.bold("Network")}: ${getIp()}:${port}`);
        console.log();
    });
}

checkPort(PORT, (err, port) => {
    if (err) {
        throw err;
    }

    startDevServer(port, "0.0.0.0");
});