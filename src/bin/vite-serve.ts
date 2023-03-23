import { createServer } from "vite"
import yargs from "yargs"
import { viteCommons, getPlugins } from "./commons.js"

export default function createServeCommand(y: typeof yargs) {
    y.command(
        ["serve", "start"],
        "Start dev server",
        {
            ...viteCommons, 
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
            extensions,
            port,
            https,
            open,
            base,
            root
        }) => {
            const server = await createServer({
                plugins: getPlugins(framework),
                root: root as string,
                clearScreen: true,
                base: base as string,
                resolve: {
                    extensions: extensions  as string[] | undefined
                },
                css: {
                    devSourcemap: true
                },
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