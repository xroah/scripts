import { build } from "vite"
import yargs from "yargs"
import {
    viteCommons,
    buildCommons,
    getPlugins
} from "./commons.js"

export default function createViteBuildCommand(y: typeof yargs) {
    y.command(
        ["vite", "vite-build"],
        "Build with vite",
        {
            ...viteCommons,
            ...buildCommons,
            target: {
                alias: "t",
                desc: "Build target",
                type: "string",
                requiresArg: true
            }
        },
        async ({
            framework,
            extensions,
            config,
            base,
            target,
            outDir,
            root
        }) => {
            const plugins = getPlugins(framework)

            await build({
                resolve: {
                    extensions: extensions as string[],
                },
                base: base as string,
                plugins,
                root: root as string,
                build: {
                    target,
                    outDir: outDir as string
                }
            })
        }
    )
}