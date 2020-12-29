#!/usr/bin/env node

import {program} from "commander"
import "./commands/start"
import "./commands/build"

program
    .version("1.0.0", "-v, --version")
    .action(cmd => {
        console.log("===>", cmd.config)
    })

program.parse()