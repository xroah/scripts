import {
    RollupOptions,
    OutputOptions,
    rollup,
    InputPluginOption,
    GlobalsOption
} from "rollup"
import { join as joinPath } from "node:path"
import typescript from "@rollup/plugin-typescript"
import resolve from "@rollup/plugin-node-resolve"
import cjs from "@rollup/plugin-commonjs"
import { babel } from "@rollup/plugin-babel"
import terser from "@rollup/plugin-terser"
import yargs from "yargs"
import ora from "ora"
import chalk from "chalk"
import scss from "rollup-plugin-scss"
import {
    DEFAULT_OUT_DIR,
    buildParams,
    commonParams
} from "./common-params.js"
import { getAbsPath } from "../utils/path-utils.js"
import loadConfig from "../utils/load-config.js"

type Target = "es5" | "es2015"

interface Options {
    entry?: string
    name?: string
    external?: string[]
    outDir?: string
    globals?: string[]
    config?: string
    target?: "es5" | "es2015"
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
        outDir,
        target
    }: Options = {}
) {
    const {
        output,
        ts,
        babel: babelConf,
        scss: scssConf,
        ...rest
    } = await loadConfig(config)
    const dist = outDir ?? output?.outDir ?? DEFAULT_OUT_DIR
    const realName = name ?? "main"
    const commonOutputConf: OutputOptions = {
        ...output,
        generatedCode: target ?? output?.generatedCode ?? "es2015",
        name: realName,
        format: "umd",
        globals: getGlobals(globals) ?? output?.globals,
        assetFileNames: "[name][extname]"
    }
    const plugins: InputPluginOption = [
        resolve(),
        cjs(),
        typescript({
            tsconfig: getAbsPath("tsconfig.json"),
            ...ts
        }),
        babel({
            exclude: /node_modules/,
            extensions: [".ts", ".tsx", ".js", ".jsx"],
            babelHelpers: "bundled",
            ...babelConf
        }),
        scss({
            outputStyle: "compressed",
            fileName: `${realName}.min.css`,
            ...scssConf
        })
    ]
    const outputOption: OutputOptions = {
        ...commonOutputConf,
        file: joinPath(dist, `${realName}.js`)
    }
    const outputProdOption: OutputOptions = {
        ...commonOutputConf,
        file: joinPath(dist, `${realName}.min.js`),
        plugins: [terser()],
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
            },
            target: {
                alias: "t",
                desc: "Output.generateCode",
                type: "string",
                choices: ["es5", "es2015"]
            }
        },
        async argv => {
            const spinner = ora(chalk.cyan("Building..."))

            spinner.start()

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
                config: argv.config as string,
                target: argv.target as Target
            })
            const bundle = await rollup(inputOptions)

            await bundle.write(outputOption)
            await bundle.write(outputProdOption)
            spinner.stop()

            console.log(chalk.green("Built successfully."))
        }
    )
}