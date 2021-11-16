#!/usr/bin/env node

import {program} from "commander"
import {readFileSync} from "fs"
import {join} from "path"
/**
 * https://nodejs.org/api/esm.html#mandatory-file-extensions
 * A file extension must be provided when using the import keyword to
 * resolve relative or absolute specifiers. 
 * Directory indexes (e.g. './startup/index.js') must also be fully specified.
 * This behavior matches how import behaves in browser environments, 
 * assuming a typically configured server.
 * 
 * Just import {HelloWorld} from "./HelloWorld.js"; TypeScript is clever enough to
 * figure out what you want is HelloWorld.ts during compilation.
 */
import getProjectRoot from "../utils/get-project-root.js"
import {commands, NAME} from "./constants.js"

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