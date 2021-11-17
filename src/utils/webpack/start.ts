import open from "open"
import chalk from "chalk"
import webpack from "webpack"
import DevServer from "./dev-server.js"
import {Configuration as DevServerConf} from "webpack-dev-server"
import checkPort from "../check-port.js"
import clearConsole from "../clear-console.js"
import getIp from "../get-ip.js"
import padSpace from "../pad-space.js"
import resizeString from "../resize-string.js"
import getCurrentTime from "../get-current-time.js"

const DEFAULT_PORT = 3000
const DEFAULT_HOST = "0.0.0.0"

function isPlainObject(obj: any) {
    return !!obj && Object.prototype.toString.call(obj) === "[object Object]"
}

function handleOption(options: DevServerConf) {
    const _options = isPlainObject(options) ? options : {}

    _options.host = options.host || DEFAULT_HOST
    _options.port = options.port || DEFAULT_PORT

    return _options
}

function handleHost(host?: string) {
    const lh = "localhost"

    if (!host) {
        return lh
    }

    if (host === DEFAULT_HOST) {
        return lh
    }

    return host
}

function handlePort(port: number, https = false) {
    if (
        (https && port === 443) ||
        port === 80
    ) {
        return ""
    }

    return `:${port}`
}

function startDevServer(
    webpackConfig: webpack.Configuration,
    options: DevServerConf
) {
    const {
        open: _open,
        port,
        host,
        https
    } = options
    const protocol = https ? "https" : "http"

    //windows can not open 0.0.0.0:port
    options.open = false
    webpackConfig.stats = "none"

    const compiler = webpack(webpackConfig)
    const server = new DevServer(options, compiler)
    const events = ["SIGINT", "SIGTERM"]
    const localUrl = `${protocol}://${handleHost(host)}${handlePort(+port!, !!https)}`

    if (_open) {
        open(localUrl)
    }
    
    compiler.hooks.compile.tap("compile", () => {
        clearConsole()
        console.log(
            chalk.greenBright("Compiling")
        )
    })
    compiler.hooks.done.tap("done", stats => {
        const time = padSpace(getCurrentTime(), 5)
        const LABEL_LENGTH = 8

        clearConsole()

        //error
        if (stats.hasErrors()) {
            console.log(chalk.red("Failed to compile."))
            console.log(
                stats.toJson().errors?.map((e: any) => e.message).join("\n\n")
            )
        } else {
            console.log()
            console.log(
                time +
                chalk.green("Compiled successfully")
            )
            console.log()
            console.log("You can view the app in your browser: ")
            console.log()
            console.log(
                `${resizeString("Local:", LABEL_LENGTH)} `,
                chalk.bold(chalk.cyan(localUrl))
            )
            console.log(
                `${resizeString("Network:", LABEL_LENGTH)} `,
                chalk.bold(chalk.cyan(`${protocol}://${getIp()}${handlePort(+port!, !!https)}`))
            )
            console.log()
            console.log(
                "To create production bundle, run:",
                chalk.green("npm run build")
            )
        }
    })

    server.startCallback(
        (err?: any) => {
            if (err) {
                throw err
            }

            clearConsole()

            console.log()
            console.log(chalk.greenBright("Starting dev server..."))
        }
    )

    events.forEach(sig => {
        process.on(sig, () => {
            server.close()
            process.exit()
        })
    })
}

export default (
    webpackConfig: webpack.Configuration,
    devServerOptions: DevServerConf
) => {
    const options = handleOption(devServerOptions)
    const port = options.port as number

    if ((options as any).progress !== false) {
        (webpackConfig.plugins || []).push(
            new webpack.ProgressPlugin({
                activeModules: true
            })
        )
    }

    checkPort(
        port,
        options.host as string,
        (err: Error, availablePort: number) => {
            if (err) {
                throw err
            }

            options.port = availablePort

            //the port is already in use
            if (port !== availablePort) {
                console.log(chalk.red(`The port ${port} is already in use`))
            }

            startDevServer(webpackConfig, options)
        }
    )
}
