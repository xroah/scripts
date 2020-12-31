#!/usr/bin/env node

import {program} from "commander"
import "./commands/start"
import "./commands/build"
import "./commands/tsc"

const packageJSON = require("../package.json")

program
    .version(packageJSON.version, "-v, --version")
    .action(cmd => {
        console.log("===>", cmd.config)
    })

program.parse()