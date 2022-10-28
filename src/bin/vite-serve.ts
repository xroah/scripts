import { createServer } from "vite"
import yargs from "yargs"
import viteCommon, { getPlugins } from "./vite-common.js"

export default function createServeCommand(y: typeof yargs) {
    y.command(
        ["serve", "start"],
        "Start dev server",
        {
            ...viteCommon, 
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
            }
        },
        async ({
            framework,
            config,
            jsx,
            extensions,
            port,
            https,
            open,
            base
        }) => {
            const server = await createServer({
                plugins: getPlugins(framework, jsx),
                root: process.cwd(),
                clearScreen: true,
                base: base as string,
                resolve: {
                    extensions: extensions  as string[] | undefined
                },
                configFile: config ? config as string : false,
                server: {
                    host: true,
                    open: open,
                    port: port,
                    https: https
                }
            })

            await server.listen()

            server.printUrls()
        }
    )
}