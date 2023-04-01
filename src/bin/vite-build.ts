import { build, InlineConfig } from "vite"
import yargs from "yargs"
import loadConfig from "../utils/load-config.js"
import {
    viteCommons,
    buildCommons,
    getPlugins,
    getSharedViteConf,
    commonParams
} from "./common-conf.js"

export default function createViteBuildCommand(y: typeof yargs) {
    y.command(
        ["vite", "vite-build"],
        "Build with vite",
        {
            ...viteCommons,
            ...buildCommons,
            ...commonParams,
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
            const fileConfig = await loadConfig(config as string)
            const {
                resolve,
                build: buildConf,
                react,
                ...restConfig
            } = fileConfig?.vite ?? {}
            const inlineConfig: InlineConfig = {
                resolve: {
                    ...resolve,
                    extensions: extensions ?? resolve?.extensions,
                },
                plugins: getPlugins(framework, react),
                build: {
                    ...buildConf,
                    target: target ?? buildConf?.target,
                    outDir: outDir ?? buildConf?.outDir
                },
                ...getSharedViteConf(
                    restConfig,
                    {
                        root: root as string,
                        base: base as string
                    }
                )
            }

            await build(inlineConfig)
        }
    )
}