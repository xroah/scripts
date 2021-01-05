#!/usr/bin/env node

import {program} from "commander"
import "./commands/start"
import "./commands/build"
import "./commands/tsc"
import "./commands/lint"
import "./commands/test"
import "./commands/rm"

const packageJSON = require("../package.json")

program
    .version(packageJSON.version, "-v, --version")

program.parse()