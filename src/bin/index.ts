#!/usr/bin/env node

import {program} from "commander"
import "./start"

program
    .version("1.0.0", "-v, --version")
    .option("-c, --config <value>", "Configuration file")
    .action(cmd => {
        console.log("===>", cmd.config)
    })

program.parse()