#!/usr/bin/env node

import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import { NAME } from "../utils/constants.js"
import createRMCommand from "./rm.js"
import createServeCommand from "./vite-serve.js"

const cli = yargs(hideBin(process.argv))
    .scriptName(NAME)
    // default command
    .command("$0", "Help", {}, () => {
        cli.showHelp()
    })

createRMCommand(cli)
createServeCommand(cli)

cli.parse()