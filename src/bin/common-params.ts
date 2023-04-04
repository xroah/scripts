import { Options } from "yargs"

export type Builder = { [key: string]: Options }

export const buildParams: Builder = {
    outDir: {
        alias: "d",
        desc: "Output directory",
        default: "dist",
        requiresArg: true
    }
}

export const commonParams: Builder = {
    config: {
        alias: "c",
        type: "string",
        desc: "Config file",
        requiresArg: true
    },
    framework: {
        alias: "f",
        type: "string",
        desc: "Framework(react or none)",
        default: "react"
    },
}

