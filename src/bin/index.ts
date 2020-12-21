#!/usr/bin/env node

import {program} from "commander"
import "./start"
import "./build"

program
    .version("1.0.0", "-v, --version")
    .action(cmd => {
        console.log("===>", cmd.config)
    })

program.parse()