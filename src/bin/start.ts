import {program} from "commander"

const start = program.command("start")

start.option("-p, --port [value]", "Specify a port")
    .option("-o, --open", "Open browser")
    .action(function (cmd) {
        console.log(cmd.port, cmd.open, "<<<<<")
    })