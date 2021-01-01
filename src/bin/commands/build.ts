import {program} from "commander"
import merge from "../utils/merge"
import {build as webpackBuild} from "webpack-build-helper"
import prodConf from "../../config/webpack/webpack.prod"
import path from "path"
import getRollupOptions from "../../config/rollup/rollup.config"
import {rollup} from "rollup"
import ora from "ora"
import chalk from "chalk"
import rimraf from "rimraf"

const build = program.command("build")

async function rollupBuild(buildOptions: any) {
    const {
        ts,
        config
    } = buildOptions
    const cmdSet = new Set([
        "entry",
        "outDir",
        "libName",
        "include"
    ])
    const loading = ora("Building for production use rollup")
    const cmdConfig: any = {}
    let mergedConfig: any = {}

    loading.start()

    if (config) {
        mergedConfig = require(path.join(process.cwd(), config)).rollup
    }

    for (let c in buildOptions) {
        if (cmdSet.has(c)) {
            cmdConfig[c] = buildOptions[c]
        }
    }

    mergedConfig = {
        ...mergedConfig,
        ...cmdConfig
    }

    const {
        options: rollupOptions,
        outputOption,
        outputProdOption,
        dist
    } = getRollupOptions(mergedConfig, ts)

    try {
        rimraf.sync(dist)
    } catch (error) {
        //empty
    }

    try {
        const bundle = await rollup(rollupOptions)

        await bundle.write(outputOption)
        await bundle.write(outputProdOption)
        await bundle.close()

        loading.stop()
        console.log()
        console.log(chalk.green("Built successfully"))
        console.log()
    } catch (error) {
        loading.stop()
        console.log(error)
    }
}

function action(cmd: any) {
    const {
        rollup: useRollup,
        config,
        ts,
        entry,
        index
    } = cmd

    if (!useRollup) {
        const {merged} = merge(prodConf, config, ts, entry, index)

        return webpackBuild(merged)
    }

    rollupBuild(cmd)
}

build
    .option("-r, --rollup", "Use rollup to build")
    .option("--no-ts", "Use javascript")
    .option("-c, --config <value>", "Configuration file")
    .option("-o, --outDir <value>", "Output dir")
    .option("-e, --entry <value>", "Entry file")
    .option("-n, --libName <value>", "Library name(rollup only)")
    .option("--include <value>", "Typescript includes(rollup only)")
    .option("--index <value>", "index.html file")
    .action(action)