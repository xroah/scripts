import { Options } from "yargs"
import { PluginOption } from "vite"
import react from "@vitejs/plugin-react"

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

export function getPlugins(framework: unknown) {
    const plugins: PluginOption[] = []

    if (framework) {
        framework = (framework as string).toLowerCase()
    }

    if (framework === "react") {
        plugins.push(react())
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