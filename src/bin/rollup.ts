import {
    RollupOptions,
    OutputOptions,
    rollup,
    InputPluginOption
} from "rollup"
import { join as joinPath } from "path"
import typescript from "@rollup/plugin-typescript"
import resolve from "@rollup/plugin-node-resolve"
import cjs from "@rollup/plugin-commonjs"
import { babel } from "@rollup/plugin-babel"
import terser from "@rollup/plugin-terser"
import yargs from "yargs"
import { buildParams, commonParams } from "./common-params.js"
import { getAbsPath } from "../utils/path-utils.js"
import { GlobalsOption } from "rollup"
import loadConfig from "../utils/load-config.js"

interface Options {
    entry?: string
    name?: string
    external?: string[]
    outDir?: string
    globals?: string[]
    config?: string
}

function getGlobals(globals?: string[]) {
    if (!globals) {
        return null
    }

    const ret: GlobalsOption = {}

    for (const g of globals) {
        if (!g.includes(":")) {
            continue
        }

        const tmp = g.split(":")
        ret[tmp[0]] = tmp[1]
    }

    return ret
}

async function getRollupOptions(
    {
        name,
        entry,
        external,
        globals,
        config,
        outDir
    }: Options = {}
) {
    const { output, ...rest } = await loadConfig(config)
    const dist = outDir ?? output?.outDir ?? "dist"
    const commonOutputConf: OutputOptions = {
        ...output,
        name,
        format: "umd",
        globals: getGlobals(globals) ?? output?.globals
    }
    const plugins: InputPluginOption = [
        resolve(),
        cjs(),
        typescript({
            tsconfig: getAbsPath("tsconfig.json")
        }),
        babel({
            exclude: /node_modules/,
            extensions: [".ts", ".tsx", ".js", ".jsx"],
            babelHelpers: "bundled"
        }),
        terser()
    ]
    const outputOption: OutputOptions = {
        ...commonOutputConf,
        file: joinPath(dist, `${name}.js`)
    }
    const outputProdOption: OutputOptions = {
        ...commonOutputConf,
        file: joinPath(dist, `${name}.min.js`),
        sourcemap: true
    }
    const inputOptions: RollupOptions = {
        ...rest,
        input: entry ?? rest?.entry ?? "./src/index.tsx",
        plugins,
        external: external ?? rest?.external
    }

    return {
        inputOptions,
        outputOption,
        outputProdOption
    }
}

export default function createRollupCommand(y: typeof yargs) {
    y.command(
        "rollup",
        "Build with rollup",
        {
            ...buildParams,
            ...commonParams,
            entry: {
                alias: "e",
                desc: "Entry of bundle",
                type: "string",
                requiresArg: true
            },
            name: {
                alias: "n",
                desc: "Output.name",
                type: "string",
                requiresArg: true
            },
            globals: {
                alias: "g",
                desc: "Output.globals(eg: react: React)",
                type: "array",
                requiresArg: true
            },
            external: {
                alias: "x",
                desc: "Same as external option of Rollup.",
                type: "array",
                requiresArg: true
            }
        },
        async argv => {
            const {
                inputOptions,
                outputOption,
                outputProdOption
            } = await getRollupOptions({
                entry: argv.entry,
                outDir: argv.outDir as string,
                globals: argv.globals as string[],
                external: argv.external as string[],
                name: argv.name,
                config: argv.config as string
            })
            const bundle = await rollup(inputOptions)

            await bundle.write(outputOption)
            await bundle.write(outputProdOption)
        }
    )
}