#!/usr/bin/env node

import {program} from "commander"
import {readFileSync} from "fs"
import {join} from "path"
import getProjectRoot from "../utils/get-project-root"

const rootDir = getProjectRoot()
const pkg = JSON.parse(readFileSync(join(rootDir, "package.json")).toString())

const commands = [{
    name: "rm",
    desc: "Remove directories or files"
}, {
    name: "start",
    desc: "Start a dev server"
}, {
    name: "build",
    desc: "Build the project"
}, {
    name: "lint",
    desc: "Run eslint"
}, {
    name: "tsc",
    desc: "Transpile ts[x] files"
}, {
    name: "test",
    desc: "Run test"
}]

program
    .name("reap-scripts")
    .version(pkg.version, "-v, --version")

for (let cmd of commands) {
    program.command(
        cmd.name,
        cmd.desc,
        {executableFile: `./commands/${cmd.name}`}
    )
}

program.parse()