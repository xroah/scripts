import { Options } from "yargs"

export type Builder = { [key: string]: Options }

export const buildParams: Builder = {
    outDir: {
        alias: "d",
        desc: "Output directory",
        requiresArg: true
    }
}

export const DEFAULT_OUT_DIR = "dist"

export const commonParams: Builder = {
    config: {
        alias: "c",
        type: "string",
        desc: "Config file",
        requiresArg: true
    }
}

