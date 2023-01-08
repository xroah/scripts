import { RollupOptions, OutputOptions } from "rollup"
import path from "path"
import typescript from "@rollup/plugin-typescript"
import resolve from "@rollup/plugin-node-resolve"
import cjs from "@rollup/plugin-commonjs"
import { babel } from "@rollup/plugin-babel"

export default function getRollupOptions(
    customOption: any = {}
    , ts = true
) {
    const dist = "dist"
    const name = customOption.libName || "reap"
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
    const plugins: any = [
        resolve(),
        cjs(),
        ts && typescript({
            tsconfig: false,
            target: "ESNext",
            jsx: "react",
            strict: true,
            moduleResolution: "node",
            include: customOption.include || ["src"],
            exclude: customOption.exclude || ["node_modules"],
            esModuleInterop: true,
            experimentalDecorators: true
        }),
        babel({
            exclude: /node_modules/,
            extensions: [".ts", ".tsx", ".js", ".jsx"],
            babelHelpers: "runtime"
        })
    ].filter(Boolean)
    const outputOption: OutputOptions = {
        ...commonOutputConf,
        file: path.join(dist, `${name}.js`)
    }
    const outputProdOption: OutputOptions = {
        ...commonOutputConf,
        file: path.join(dist, `${name}.min.js`),
        sourcemap: true
    }
    const options: RollupOptions = {
        input: "./src/index.ts",
        output: [outputOption, outputProdOption],
        plugins,
        external: customOption.external === false ? [] :
            (customOption.external || ["react", "react-dom"])
    }

    return {
        options,
        outputOption,
        outputProdOption,
        dist
    }
}