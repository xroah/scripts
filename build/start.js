const checkPort = require("./utils/checkPort");
const DevServer = require("webpack-dev-server");
const webpack = require("webpack");
const conf = require("./webpack.config");
const clearConsole = require("./utils/clearConsole");
const getDate = require("./utils/getDate");
const getIp = require("./utils/getIp");
const open = require("open");
const chalk = require("chalk");

const PORT = 8000;

function startDevServer(port) {
    const host = "0.0.0.0";
    const devConf = conf("development");
    const options = {
        contentBase: devConf.output.path,
        hot: true,
        compress: true,
        quiet: true,
        overlay: false,
        watchContentBase: true,
        historyApiFallback: true,
        host,
        port
    };
    const compiler = webpack(devConf);
    const server = new DevServer(compiler, options);
    let isFirstRun = true;
    const clearLine = function clearLine() {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
    }

    compiler.hooks.compile.tap("compile", () => {
        clearLine();
        process.stdout.write(
            chalk.greenBright("Compiling")
        );
    });

    compiler.hooks.done.tap("done", stats => {
        const date = `${getDate()}:      `;

        if (isFirstRun) {
            clearConsole();
            //print empty line
            console.log();
            console.log(
                chalk.greenBright("Server started successfully!")
            );
            console.log();
            console.log(`${chalk.bold("Local")}: localhost:${port}`);
            console.log(`${chalk.bold("Network")}: ${getIp("IPv4")}:${port}`);
            console.log();
            console.log(
                "To create production bundle, run:",
                chalk.green("npm run build")
            );
            console.log();

            process.stdout.write(
                date +
                chalk.green("Compiled successfully")
            );
        } else {
            clearLine();
            process.stdout.write(
                date +
                chalk.green("Updated")
            );
        }

        isFirstRun = false;
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
        console.log();
        console.log(chalk.greenBright("Starting dev server..."));

        await open(`http://localhost:${port}`);
    });
}

checkPort(PORT, (err, port) => {
    if (err) {
        throw err;
    }

    startDevServer(port, "0.0.0.0");
});