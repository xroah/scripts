import { Options } from "yargs"
import { InlineConfig, PluginOption } from "vite"
import react, { Options as ReactOptions } from "@vitejs/plugin-react"

type Builder = { [key: string]: Options }

export const viteCommons: Builder = {
    framework: {
        alias: "f",
        type: "string",
        desc: "Framework(react or none)",
        default: "react"
    },
    extensions: {
        alias: "e",
        type: "string",
        array: true,
        desc: "Resolve extensions",
        requiresArg: true
    },
    config: {
        alias: "c",
        type: "string",
        desc: "Config file",
        requiresArg: true
    },
    base: {
        alias: "b",
        type: "string",
        desc: "Public base path",
        requiresArg: true,
        default: "/"
    },
    root: {
        desc: "Project root dir",
        requiresArg: true,
        type: "string",
        default: process.cwd()
    }
}

export function getPlugins(
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

export const buildCommons: Builder = {
    outDir: {
        alias: "d",
        desc: "Output directory",
        default: "dist",
        requiresArg: true
    }
}

export function getSharedViteConf(
    conf: InlineConfig,
    cmdConf: InlineConfig
) {
    return {
        base: cmdConf.base ?? conf?.base ?? "./",
        root: cmdConf.root ?? conf?.root
    }
}