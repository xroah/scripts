import { createServer, PluginOption } from "vite"
import react from "@vitejs/plugin-react"
import vue from "@vitejs/plugin-vue"
import vueJSX from "@vitejs/plugin-vue-jsx"
import yargs from "yargs"
import viteCommon from "./vite-common.js"

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
            const plugins: PluginOption[] = []

            switch (framework) {
                case "react":
                    plugins.push(react)
                    break
                case "vue":
                    plugins.push(vue())

                    if (jsx) {
                        plugins.push(vueJSX())
                    }
                    break
                case "none":
                    break
                default:
                    throw new Error("Unknown framework")
            }
            
            const server = await createServer({
                plugins,
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