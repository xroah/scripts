import { Options } from "yargs";

export default {
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
    }
} as {[key: string]: Options}