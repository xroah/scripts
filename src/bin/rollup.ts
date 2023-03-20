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
import { buildCommons } from "./commons.js"

function getRollupOptions(
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
            tsconfig: false,
            target: "ESNext",
            jsx: "react",
            strict: true,
            moduleResolution: "node",
            include: customOption.include || ["src/**/*"],
            exclude: customOption.exclude || ["node_modules"],
            esModuleInterop: true,
            experimentalDecorators: true
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
            ...buildCommons
        },
        async () => {
            const options = getRollupOptions()
            const bundle = await rollup(options.inputOptions)

            await bundle.write(options.outputOption)
        }
    )
}