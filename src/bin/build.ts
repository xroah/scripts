import yargs from "yargs"
import buildWithVite from "./vite-build.js"
import viteCommon from "./vite-common.js"

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
            },
            tool: {
                desc: "Build tool(vite or rollup)",
                default: "vite"
            }
        },
        async ({
            framework,
            jsx,
            extensions,
            config,
            base,
            target,
            outDir,
            tool
        }) => {
            switch (tool) {
                case "vite":
                    buildWithVite({
                        framework: framework as string,
                        jsx: jsx as boolean,
                        extensions: extensions as string[],
                        config: config as string,
                        base: base as string,
                        target,
                        outDir
                    })
                    break
            }
        }
    )
}