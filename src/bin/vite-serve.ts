import { createServer, InlineConfig } from "vite"
import yargs from "yargs"
import loadConfig from "../utils/load-config.js"
import { viteCommons, getPlugins, getSharedViteConf, commonParams } from "./common-conf.js"

export default function createServeCommand(y: typeof yargs) {
    y.command(
        ["serve", "start"],
        "Start dev server",
        {
            ...viteCommons,
            ...commonParams,
            port: {
                alias: "p",
                type: "number",
                default: 3000,
                desc: "Port",
                requiresArg: true
            },
            open: {
                alias: "o",
                type: "boolean",
                desc: "Open browser"
            },
            https: {
                type: "boolean"
            },
            host: {
                type: "boolean"
            }
        },
        async ({
            framework,
            config,
            extensions,
            port,
            https,
            open,
            base,
            root,
            host
        }) => {
            const fileConfig = await loadConfig(config as string)
            const {
                resolve,
                css,
                react,
                server: serverConf,
                ...restConfig
            } = fileConfig?.vite ?? {}
            const inlineConfig: InlineConfig = {
                plugins: getPlugins(framework, react),
                clearScreen: true,
                resolve: {
                    ...resolve,
                    extensions: extensions ?? resolve?.extensions
                },
                css: {
                    devSourcemap: true,
                    ...css
                },
                server: {
                    ...serverConf,
                    host: host ?? serverConf?.host ?? true,
                    open: open ?? serverConf?.open,
                    port: port ?? serverConf?.port,
                    https: https ?? serverConf?.https
                },
                ...getSharedViteConf(
                    restConfig,
                    {
                        root: root as string,
                        base: base as string
                    }
                )
            }

            const server = await createServer(inlineConfig)

            await server.listen()

            server.printUrls()
        }
    )
}