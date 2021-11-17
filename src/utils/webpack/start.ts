import open from "open"
import chalk from "chalk"
import webpack, {Stats} from "webpack"
import DevServer from "./dev-server.js"
import {Configuration as DevServerConf} from "webpack-dev-server"
import checkPort from "../check-port.js"
import clearConsole from "../clear-console.js"
import getIp from "../get-ip.js"
import padSpace from "../pad-space.js"
import resizeString from "../resize-string.js"
import getCurrentTime from "../get-current-time.js"
import isPlainObject from "../is-plain-object.js"

declare module "webpack-dev-server" {
    interface Configuration {
        progress?: boolean
    }
}

const DEFAULT_PORT = 3000
const DEFAULT_HOST = "0.0.0.0"

function handleOption(options: DevServerConf) {
    const _options = isPlainObject(options) ? options : {}

    _options.host = options.host || DEFAULT_HOST
    _options.port = options.port || DEFAULT_PORT

    return _options
}

function handleHost(host?: string) {
    const lh = "localhost"

    if (!host || host === DEFAULT_HOST) {
        return lh
    }

    return host
}

function handlePort(port: number, https = false) {
    if ((https && port === 443) || port === 80) {
        return ""
    }

    return `:${port}`
}

function handleCompile() {
    clearConsole()
    console.log(chalk.greenBright("Compiling"))
}

function createDoneCallback(
    protocol: string,
    localUrl: string,
    portString: string
) {
    return (stats: Stats) => {
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
                chalk.bold(chalk.cyan(`${protocol}://${getIp()}${portString}`))
            )
            console.log()
            console.log(
                "To create production bundle, run:",
                chalk.green("npm run build")
            )
        }
    }
}

function start(server: DevServer) {
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
}

function handleProcessEvents(server: DevServer) {
    ["SIGINT", "SIGTERM"].forEach(sig => {
        process.on(sig, () => {
            server.stopCallback(
                (err?: any) => {
                    if (err) {
                        throw err
                    }

                    process.exit()
                }
            )
        })
    })
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
    const _port = handlePort(+port!, !!https)
    const localUrl = `${protocol}://${handleHost(host)}${_port}`

    if (_open) {
        open(localUrl)
    }

    compiler.hooks.compile.tap("compile", handleCompile)
    compiler.hooks.done.tap(
        "done",
        createDoneCallback(protocol, localUrl, _port)
    )

    start(server)
    handleProcessEvents(server)
}


export default (
    webpackConfig: webpack.Configuration,
    devServerOptions: DevServerConf
) => {
    const options = handleOption(devServerOptions)
    const port = options.port as number

    if (options.progress !== false) {
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
