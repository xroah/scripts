#!/usr/bin/env node

import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import createViteBuildCommand from "./vite-build.js"
import createRMCommand from "./rm.js"
import createServeCommand from "./vite-serve.js"
import createInitCommand from "./init.js"
import createRollupCommand from "./rollup.js"

const NAME = "r-scripts"

const cli = yargs(hideBin(process.argv))
    .usage("$0 <cmd> [args]")
    .scriptName(NAME)
    // default command
    .command("$0", "Help", {}, () => {
        cli.showHelp()
    })

createRMCommand(cli)
createServeCommand(cli)
createViteBuildCommand(cli)
createInitCommand(cli)
createRollupCommand(cli)

cli
    .alias("help", "h")
    .alias("version", "v")
    .parse()