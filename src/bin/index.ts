#!/usr/bin/env node

import commander from "commander"
import createStartCommand from "./start"

const main = commander.program

main.version("1.0.0", "-v, --version")

createStartCommand(main)

main.parse()