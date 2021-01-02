import {program} from "commander"

function action(file: string, cmd: any) {

}

program
    .command("test [file]")
    .action(action)