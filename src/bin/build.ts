import {build} from "vite"
import yargs from "yargs"
import viteCommon, { getPlugins } from "./vite-common.js"

export default function createViteBuildCommand(y: typeof yargs) {
    y.command(
        "build",
        "Build for production",
        {
            ...viteCommon,
            target: {
                alias: "t",
                desc: "Build target",
                type: "string",
                requiresArg: true
            },
            outDir: {
                alias: "d",
                desc: "Output directory",
                default: "dist"
            }
        },
        async({
            framework,
            jsx,
            extensions,
            config,
            base,
            target,
            outDir
        }) => {
            const plugins = getPlugins(framework, jsx)
            
            await build({
                configFile: config ? config as string : false,
                resolve: {
                    extensions: extensions as string[],
                },
                base: base as string,
                plugins,
                build: {
                    target,
                    outDir
                }
            })
        }
    )
}