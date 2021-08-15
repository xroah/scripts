import {program} from "commander"
import merge from "../../utils/merge-webpack"
import {build as webpackBuild} from "webpack-build-helper"
import getProdConf from "../../config/webpack/webpack.prod"
import getRollupOptions from "../../config/rollup/rollup.config"
import {rollup} from "rollup"
import ora from "ora"
import chalk from "chalk"
import rimraf from "rimraf"
import loadConfig from "../../utils/load-config"
import setEnv from "../../utils/set-env"
import getAbsPath from "../../utils/get-abs-path"
import {NAME} from "../constants"

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

function action(cmd: any) {
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
        const {merged} = merge(
            getProdConf(),
            {
                configFile: config,
                ts,
                entry,
                index
            }
        )

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
    .name(NAME)
    .command("build")
    .option("-r, --rollup", "Use rollup to build")
    .option("--no-ts", "Build javascript")
    .option("-c, --config <file>", "Configuration file")
    .option("-o, --outDir <dir>", "Output dir")
    .option("-e, --entry <entry>", "Entry file, default src/index.[jt]sx")
    .option("-n, --libName <name>", "Library name(rollup only)")
    .option("--include <files...>", "Typescript includes(rollup only)")
    .option("--exclude <files...>", "Typescript excludes(rollup only)")
    .option("--index <index>", "index.html file, default public/index.html")
    .action(action)
    .parse()