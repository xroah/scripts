import chalk from "chalk"
import {program} from "commander"
import fs from "fs"
import path from "path"

const tsc = program.command("tsc")

function initTs() {
    const filePath = path.join(__dirname, "../../tsconfig.json")
    const destFile = path.join(process.cwd(), "tsconfig.json")

    if (fs.existsSync(destFile)) {
        return console.log(chalk.red("tsconfig.json already exists"))
    }

    fs.copyFileSync(filePath, destFile)
    console.log(chalk.green("Successfully created a tsconfig.json file"))
}

function action(cmd: any) {
    const {init} = cmd

    if (init) {
        initTs()
    }
}

tsc.option("--init", "Init tsconfig.json")
    .action(action)
