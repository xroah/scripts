import {
    PluginOption,
    InlineConfig,
    build,
    createServer
} from "vite"
import react, { Options as ReactOptions } from "@vitejs/plugin-react"
import yargs from "yargs"
import loadConfig from "../utils/load-config.js"
import {
    Builder,
    DEFAULT_OUT_DIR,
    buildParams,
    commonParams
} from "./common-params.js"

const params: Builder = {
    extensions: {
        alias: "e",
        type: "string",
        array: true,
        desc: "Resolve extensions",
        requiresArg: true
    },
    base: {
        alias: "b",
        type: "string",
        desc: "Public base path",
        requiresArg: true,
        default: "/"
    },
    framework: {
        alias: "f",
        type: "string",
        desc: "Framework(react or none)",
        default: "react"
    },
    root: {
        desc: "Project root dir",
        requiresArg: true,
        type: "string",
        default: process.cwd()
    }
}

function getPlugins(
    framework: unknown,
    reactOptions?: ReactOptions
) {
    const plugins: PluginOption[] = []

    if (framework) {
        framework = (framework as string).toLowerCase()
    }

    if (framework === "react") {
        plugins.push(react(reactOptions))
    }

    return plugins
}

function getSharedViteConf(
    conf: InlineConfig,
    cmdConf: InlineConfig
): InlineConfig {
    return {
        ...conf,
        base: cmdConf.base ?? conf?.base ?? "./",
        root: cmdConf.root ?? conf?.root,
        configFile: false
    }
}

async function getFileConf(confFile: string) {
    const fileConfig = await loadConfig(confFile)

    return fileConfig.vite ?? {}
}

export function createServeCommand(y: typeof yargs) {
    y.command(
        ["serve", "start"],
        "Start dev server",
        {
            ...params,
            ...commonParams,
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
            },
            host: {
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
            root,
            host
        }) => {
            const fileConfig = await getFileConf(config as string)
            const {
                resolve,
                css,
                react,
                server: serverConf,
                ...restConfig
            } = fileConfig
            const inlineConfig: InlineConfig = {
                plugins: getPlugins(framework, react),
                clearScreen: true,
                resolve: {
                    ...resolve,
                    extensions: extensions ?? resolve?.extensions
                },
                css: {
                    devSourcemap: true,
                    ...css
                },
                server: {
                    ...serverConf,
                    host: host ?? serverConf?.host ?? true,
                    open: open ?? serverConf?.open,
                    port: port ?? serverConf?.port,
                    https: https ?? serverConf?.https
                },
                ...getSharedViteConf(
                    restConfig,
                    {
                        root: root as string,
                        base: base as string
                    }
                )
            }

            const server = await createServer(inlineConfig)

            await server.listen()

            server.printUrls()
        }
    )
}

export function createBuildCommand(y: typeof yargs) {
    y.command(
        ["vite", "vite-build"],
        "Build with vite",
        {
            ...params,
            ...buildParams,
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
            const fileConfig = await getFileConf(config as string)
            const {
                resolve,
                build: buildConf,
                react,
                ...restConfig
            } = fileConfig
            const inlineConfig: InlineConfig = {
                resolve: {
                    ...resolve,
                    extensions: extensions ?? resolve?.extensions,
                },
                plugins: getPlugins(framework, react),
                build: {
                    ...buildConf,
                    target: target ?? buildConf?.target,
                    outDir: outDir ?? buildConf?.outDir ?? DEFAULT_OUT_DIR
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