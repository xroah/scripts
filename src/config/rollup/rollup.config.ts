import {
    RollupOptions,
    OutputOptions
} from "rollup"
import path from "path"
import {terser} from "rollup-plugin-terser"
import typescript from "@rollup/plugin-typescript"
import resolve from "@rollup/plugin-node-resolve"
import cjs from "@rollup/plugin-commonjs"
import babel from "@rollup/plugin-babel"
import getBabelConf from "../babel/babel.config"

export default (customOption: any = {}, ts = true) => {
    const cwd = process.cwd()
    const dist = `${path.join(cwd, customOption.outDir || "dist")}`
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
    const plugins = [
        resolve(),
        cjs(),
        ts && typescript({
            tsconfig: false,
            target: "ESNext",
            jsx: "react",
            strict: true,
            moduleResolution: "node",
            include: [path.join(cwd, customOption.include || "src")],
            exclude: ["node_modules"],
            esModuleInterop: true,
            experimentalDecorators: true
        }),
        babel({
            exclude: /node_modules/,
            extensions: [".ts", ".tsx", ".js", ".jsx"],
            babelHelpers: "runtime",
            ...getBabelConf()
        })
    ].filter(Boolean) as any
    const outputOption: OutputOptions = {
        ...commonOutputConf,
        file: path.join(dist, `${name}.js`)
    }
    const outputProdOption: OutputOptions = {
        ...commonOutputConf,
        file: path.join(dist, `${name}.min.js`),
        sourcemap: true,
        plugins: [terser()]
    }
    const options: RollupOptions = {
        input: path.join(cwd, customOption.entry || "./src/index.ts"),
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