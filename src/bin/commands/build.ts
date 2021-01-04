import {program} from "commander"
import merge from "../utils/merge"
import {build as webpackBuild} from "webpack-build-helper"
import prodConf from "../../config/webpack/webpack.prod"
import getRollupOptions from "../../config/rollup/rollup.config"
import {rollup} from "rollup"
import ora from "ora"
import chalk from "chalk"
import rimraf from "rimraf"
import loadConfig from "../utils/load-config"

async function rollupBuild(cmd: any) {
    process.env.NODE_ENV = "production"
    process.env.BABEL_ENV = "production"

    const {
        ts,
        config
    } = cmd
    const cmdSet = new Set([
        "entry",
        "outDir",
        "libName",
        "include"
    ])
    const loading = ora("Building for production use rollup")
    const cmdConfig: any = {}
    let customConfig: any = loadConfig(config).rollup

    for (let c in cmd) {
        if (cmdSet.has(c)) {
            cmdConfig[c] = cmd[c]
        }
    }

    const mergedConfig = {
        ...customConfig,
        ...cmdConfig
    }
    const {
        options: rollupOptions,
        outputOption,
        outputProdOption,
        dist
    } = getRollupOptions(mergedConfig, ts)

    loading.start()

    try {
        rimraf.sync(dist)
    } catch (error) {
        //do nothing
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

program
    .command("build")
    .option("-r, --rollup", "Use rollup to build")
    .option("--no-ts", "Use javascript")
    .option("-c, --config <value>", "Configuration file")
    .option("-o, --outDir <value>", "Output dir")
    .option("-e, --entry <value>", "Entry file")
    .option("-n, --libName <value>", "Library name(rollup only)")
    .option("--include <value>", "Typescript includes(rollup only)")
    .option("--index <value>", "index.html file")
    .action(action)