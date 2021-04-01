#!/usr/bin/env node

import {program} from "commander"
import {readFileSync} from "fs"
import {join} from "path"
import getProjectRoot from "../utils/get-project-root"
import {commands, NAME} from "./constants"

const rootDir = getProjectRoot()
const pkg = JSON.parse(readFileSync(join(rootDir, "package.json")).toString())

program
    .name(NAME)
    .version(pkg.version, "-v, --version")

for (let cmd of commands) {
    program.command(
        cmd.name,
        cmd.desc,
        {executableFile: `./commands/${cmd.name}`}
    )
}

program.parse()