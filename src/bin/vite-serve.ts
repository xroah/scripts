import { createServer } from "vite"
import react from "@vitejs/plugin-react"
import yargs from "yargs";

export default function createServeCommand(y: typeof yargs) {
    y.command(
        ["serve", "start"],
        "Start dev server",
        {
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
            const server = await createServer({
                plugins: [react()],
                root: process.cwd(),
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