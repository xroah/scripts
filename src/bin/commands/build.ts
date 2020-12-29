import {program} from "commander"

const build = program.command("build")

build
    .option("-w, --webpack", "Use webpack to build")
    .option("-r, --rollup", "Use rollup to build")
    .option("-c, --config <value>", "Configuration file")
    .action(function (cmd) {
        console.log(cmd.webpack, cmd.rollup, cmd.config, "<<<<<")
    })