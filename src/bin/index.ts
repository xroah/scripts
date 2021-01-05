#!/usr/bin/env node

import {program} from "commander"
import "./commands/start"
import "./commands/build"
import "./commands/tsc"
import "./commands/lint"
import "./commands/test"

const packageJSON = require("../package.json")

program
    .version(packageJSON.version, "-v, --version")
    .action(cmd => {
        console.log("===>", cmd.config)
    })

program.parse()