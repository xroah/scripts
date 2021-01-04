import {program} from "commander"

process.env.NODE_ENV = "test"
process.env.BABEL_ENV = "test"

function action(file: string, cmd: any) {

}

program
    .command("test [file]")
    .action(action)