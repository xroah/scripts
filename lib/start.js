const DevServer = require("webpack-dev-server")
const webpack = require("webpack")
const chalk = require("chalk")
const open = require("open")
const checkPort = require("./utils/checkPort")
const clearConsole = require("./utils/clearConsole")
const getCurrentTime = require("./utils/getCurrentTime")
const getIp = require("./utils/getIp")

function isPlainObject(obj) {
    return !!obj && Object.prototype.toString.call(obj) === "[object Object]"
}

function handleOption(options) {
    const DEFAULT_PORT = 3000
    const _options = isPlainObject(options) ? options : {}

    _options.quiet = true

    if (!_options.port) {
        _options.port = DEFAULT_PORT
    }

    return _options
}

function startDevServer(webpackConfig, options) {
    const host = "0.0.0.0"
    const compiler = webpack(webpackConfig)
    const server = new DevServer(compiler, options)
    const events = ["SIGINT", "SIGTERM"]
    const port = options.port
    let isFirstRun = true

    compiler.hooks.compile.tap("compile", () => {
        clearConsole()
        console.log(
            chalk.greenBright("Compiling")
        )
    })

    compiler.hooks.done.tap("done", stats => {
        const time = `${getCurrentTime()}:      `
        const compilation = stats.compilation

        clearConsole()

        //error
        if (stats.hasErrors()) {
            console.log(chalk.red("Failed to compile."))
            console.log(compilation.errors.map(e => e.message).join("\n\n"))
        } else {
            if (isFirstRun && options.open) {
                open(`http://localhost:${port}`)
            }

            isFirstRun = false

            console.log()
            console.log(
                time +
                chalk.green("Compiled successfully")
            )
            console.log()
            console.log("You can view the app in your browser: ")
            console.log()
            console.log(
                `${chalk.bold("Local")}: `,
                chalk.bold(chalk.cyan(`localhost:${port}`))
            )
            console.log(
                `${chalk.bold("Network")}: `,
                chalk.bold(chalk.cyan(`${getIp()}:${port}`))
            )
            console.log()
            console.log(
                "To create production bundle, run:",
                chalk.green("npm run build")
            )
        }
    })

    server.listen(port, host, err => {
        if (err) {
            throw err
        }

        clearConsole()

        console.log()
        console.log(chalk.greenBright("Starting dev server..."))
    })

    events.forEach(sig => {
        process.on(sig, () => {
            server.close()
            process.exit()
        })
    })
}

module.exports = function start(webpackConfig, devServerOptions) {
    const options = handleOption(devServerOptions)
    const port = options.port

    checkPort(port, (err, availablePort) => {
        if (err) {
            throw err
        }

        options.port = availablePort

        //the port is already in use
        if (port !== availablePort) {
            console.log(chalk.red(`The port ${port} is already in use`))
        }

        startDevServer(webpackConfig, options)
    })
}
