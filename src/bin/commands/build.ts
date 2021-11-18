import merge from "../../utils/webpack/merge.js"
import webpackBuild from "../../utils/webpack/build.js"
import getRollupOptions from "../../config/rollup/rollup.config.js"
import {rollup} from "rollup"
import ora from "ora"
import chalk from "chalk"
import rimraf from "rimraf"
import loadConfig from "../../utils/load-config.js"
import setEnv from "../../utils/set-env.js"
import getAbsPath from "../../utils/get-abs-path.js"
import program from "./program.js"

import {
    config,
    entry,
    index,
    noTs
} from "./common-options.js"

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

    for (let c in cmd) {
        if (cmdSet.has(c)) {
            cmdConfig[c] = cmd[c]
        }
    }
    const {
        options: rollupOptions,
        outputOption,
        outputProdOption,
        dist
    } = getRollupOptions({
        ...loadConfig(config).rollup,
        ...cmdConfig
    }, ts)

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

async function action(cmd: any) {
    setEnv("production")

    const {
        rollup: useRollup,
        config,
        ts,
        entry,
        index,
        outDir
    } = cmd

    if (!useRollup) {
        const {merged} = await merge({
            configFile: config,
            ts,
            entry,
            index,
            args: cmd
        })

        if (outDir) {
            merged.output!.path = getAbsPath(outDir)
        }

        removeDist(merged.output!.path as string)
        webpackBuild(merged)

        return
    }

    rollupBuild(cmd)
}

program
    .command("build")
    .option("-r, --rollup", "Use rollup to build")
    .option(...noTs)
    .option(...config)
    .option("-o, --outDir <dir>", "Output dir")
    .option(...entry)
    .option("-n, --libName <name>", "Library name(rollup only)")
    .option("--include <files...>", "Typescript includes(rollup only)")
    .option("--exclude <files...>", "Typescript excludes(rollup only)")
    .option(...index)
    .action(action)
    .parse()