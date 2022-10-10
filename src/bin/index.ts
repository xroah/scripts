#!/usr/bin/env node

import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import { NAME } from "../utils/constants.js"
import createRMCommand from "./rm.js"

const cli = yargs(hideBin(process.argv))
    .scriptName(NAME)
    // default command
    .command("$0", "Help", {}, () => {
        cli.showHelp()
    })
    .usage('$0 <cmd> [args]')

createRMCommand(cli)

cli.parse()