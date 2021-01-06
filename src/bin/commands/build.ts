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
import setEnv from "../utils/set-env"

function removeDist(dist: string) {
    try {
        rimraf.sync(dist)
    } catch (error) {
        console.log(error)
    }
}

async function rollupBuild(cmd: any) {
    const {
        ts,
        config
    } = cmd
    const cmdSet = new Set([
        "entry",
        "outDir",
        "libName",
        "include",
        "exclude"
    ])
    const loading = ora("Building for production use rollup...")
    const cmdConfig: any = {}
    let customConfig: any = loadConfig(config).rollup

    for (let c in cmd) {
        if (cmdSet.has(c)) {
            cmdConfig[c] = cmd[c]
        }
    }

    customConfig = {
        ...customConfig,
        ...cmdConfig
    }
    const {
        options: rollupOptions,
        outputOption,
        outputProdOption,
        dist
    } = getRollupOptions(customConfig, ts)

    loading.start()
    removeDist(dist)

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

    setEnv("production")

    if (!useRollup) {
        const {merged} = merge(prodConf, config, ts, entry, index)

        removeDist(merged.output!.path!)
        webpackBuild(merged)

        return
    }

    rollupBuild(cmd)
}

program
    .command("build")
    .option("-r, --rollup", "Use rollup to build")
    .option("--no-ts", "Use javascript")
    .option("-c, --config <configFile>", "Configuration file")
    .option("-o, --outDir <dir>", "Output dir")
    .option("-e, --entry <entry>", "Entry file")
    .option("-n, --libName <name>", "Library name(rollup only)")
    .option("--include <files...>", "Typescript includes(rollup only)")
    .option("--exclude <files...>", "Typescript excludes(rollup only)")
    .option("--index <index>", "index.html file")
    .action(action)