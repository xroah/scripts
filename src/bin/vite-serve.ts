import {createServer} from "vite"
import react from "@vitejs/plugin-react"
import yargs from "yargs";

export default function createServeCommand(y: typeof yargs) {
    y.command(
        "serve",
        "Start dev server",
        {},
        async argv => {
            const server = await createServer({
                plugins: [react()],
                root: process.cwd(),
                server: {
                    host: true
                }
            }) 

            await server.listen()

            server.printUrls()

            console.log(argv)
        }
    )
}