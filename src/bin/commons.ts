import { Options } from "yargs"
import { PluginOption } from "vite"
import react from "@vitejs/plugin-react"
import vue from "@vitejs/plugin-vue"
import vueJSX from "@vitejs/plugin-vue-jsx"

type Builder = { [key: string]: Options }

export const viteCommons: Builder = {
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

export function getPlugins(framework: unknown, jsx: unknown) {
    const plugins: PluginOption[] = []

    if (framework) {
        framework = (framework as string).toLowerCase()
    }

    switch (framework) {
        case "react":
            plugins.push(react)
            break
        case "vue":
            plugins.push(vue())

            if (jsx) {
                plugins.push(vueJSX())
            }
            break
        case "none":
            break
        default:
            throw new Error("Unknown framework")
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