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
        desc: "Resolve extensions"
    },
    config: {
        alias: "c",
        type: "string",
        desc: "Config file",
        requiresArg: true
    }
} as {[key: string]: Options}