import {
    RollupOptions,
    OutputOptions,
    rollup,
    InputPluginOption
} from "rollup"
import path from "path"
import typescript from "@rollup/plugin-typescript"
import resolve from "@rollup/plugin-node-resolve"
import cjs from "@rollup/plugin-commonjs"
import { babel } from "@rollup/plugin-babel"
import terser from "@rollup/plugin-terser"
import yargs from "yargs"
import { buildParams, commonParams } from "./common-params.js"
import { getAbsPath } from "../utils/path-utils.js"

function getRollupOptions(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    customOption: any = {}
) {
    const dist = "dist"
    const name = customOption.libName || "main"
    const commonOutputConf: OutputOptions = {
        name,
        format: "umd",
        globals: customOption.globals === false ? {} :
            (
                customOption.globals ||
                {
                    "react": "React",
                    "react-dom": "ReactDOM"
                }
            )
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
        file: path.join(dist, `${name}.js`)
    }
    const outputProdOption: OutputOptions = {
        ...commonOutputConf,
        file: path.join(dist, `${name}.min.js`),
        sourcemap: true
    }
    const inputOptions: RollupOptions = {
        input: "./src/index.tsx",
        plugins,
        external: customOption.external === false ? [] :
            (customOption.external || ["react", "react-dom"])
    }

    return {
        inputOptions,
        outputOption,
        outputProdOption,
        dist
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
                desc: "Same as output.name",
                type: "string",
                requiresArg: true
            }
        },
        async () => {
            const options = getRollupOptions()
            const bundle = await rollup(options.inputOptions)

            await bundle.write(options.outputOption)
        }
    )
}