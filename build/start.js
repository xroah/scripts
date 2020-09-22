const checkPort = require("./utils/checkPort")
const DevServer = require("webpack-dev-server")
const webpack = require("webpack")
const conf = require("./webpack.config")
const clearConsole = require("./utils/clearConsole")
const getDate = require("./utils/getDate")
const getIp = require("./utils/getIp")
const open = require("open")
const chalk = require("chalk")
const PORT = 8000

function startDevServer(port) {
    const host = "0.0.0.0"
    const devConf = conf("development")
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
    }
    const compiler = webpack(devConf)
    const server = new DevServer(compiler, options)
    let isFirstRun = true

    compiler.hooks.compile.tap("compile", () => {
        clearConsole()
        console.log(
            chalk.greenBright("Compiling")
        )
    })

    compiler.hooks.done.tap("done", stats => {
        const date = `${getDate()}:      `
        const compilation = stats.compilation

        clearConsole()

        //error
        if (stats.hasErrors()) {
            console.log(chalk.red("Failed to compile."))
            console.log(compilation.errors.map(e => e.message).join("\n\n"))
        } else {
            if (isFirstRun) {
                open(`http://localhost:${port}`)
            }

            isFirstRun = false

            console.log()
            console.log(
                date +
                chalk.green("Compiled successfully")
            )
            console.log()
            console.log("You can view the app in you browser: ")
            console.log()
            console.log(
                `${chalk.bold("Local")}: `,
                chalk.bold(chalk.cyan(`localhost:${port}`))
            )
            console.log(
                `${chalk.bold("Network")}: `,
                chalk.bold(chalk.cyan(`${getIp("IPv4")}:${port}`))
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

        //port already in use
        if (port !== PORT) {
            console.log(chalk.red(`The default port ${PORT} already in use`))
        }

        console.log()
        console.log(chalk.greenBright("Starting dev server..."))
    })

    ["SIGINT", "SIGTERM"].forEach(sig => {
        process.on(sig, function () {
            server.close()
            process.exit()
        })
    })
}

checkPort(PORT, (err, port) => {
    if (err) {
        throw err
    }

    startDevServer(port, "0.0.0.0")
})
