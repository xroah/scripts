import { createServer, PluginOption } from "vite"
import react from "@vitejs/plugin-react"
import vue from "@vitejs/plugin-vue"
import vueJSX from "@vitejs/plugin-vue-jsx"
import yargs from "yargs"

export default function createServeCommand(y: typeof yargs) {
    y.command(
        ["serve", "start"],
        "Start dev server",
        {
            framework: {
                alias: "f",
                type: "string",
                desc: "Framework(vue、react or none)",
                default: "react"
            },
            jsx: {
                type: "boolean",
                desc: "Use jsx(Vue only)"
            },
            extensions: {
                alias: "e",
                type: "string",
                array: true,
                desc: "Resolve extensions"
            },
            config: {
                alias: "c",
                type: "string",
                desc: "Config file",
                requiresArg: true
            },
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
        async argv => {
            const plugins: PluginOption[] = []

            switch (argv.framework) {
                case "react":
                    plugins.push(react)
                    break
                case "vue":
                    plugins.push(vue())

                    if (argv.jsx) {
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
                resolve: {
                    extensions: argv.extensions
                },
                configFile: argv.config ? argv.config : false,
                server: {
                    host: true,
                    open: argv.open,
                    port: argv.port,
                    https: argv.https
                }
            })

            await server.listen()

            server.printUrls()
        }
    )
}