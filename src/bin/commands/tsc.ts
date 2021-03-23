import chalk from "chalk"
import {program} from "commander"
import fs from "fs"
import path from "path"
import spawn from "cross-spawn"
import rimraf from "rimraf"
import getProjectRoot from "../../utils/get-project-root"

function initTs() {
    const FILENAME = "tsconfig.json"
    const filePath = path.join(getProjectRoot(), FILENAME)
    const destFile = path.join(process.cwd(), FILENAME)

    if (fs.existsSync(destFile)) {
        return console.log(chalk.red(`${FILENAME} already exists`))
    }

    fs.copyFileSync(filePath, destFile)
    console.log(chalk.green(`Successfully created a ${FILENAME} file`))
}

function spawnTsc(args: string[], removeDir?: string) {
    try {
        if (removeDir) {
            rimraf.sync(removeDir)
        }

        spawn(
            "tsc",
            args,
            {
                shell: true,
                stdio: "inherit"
            }
        )
    } catch (error) {
        console.log(error)
    }
}

function action(file: string, cmd: any) {
    const {
        init,
        lib,
        es,
        declaration,
        dDir
    } = cmd
    const args = []

    if (init) {
        initTs()

        return
    }

    if (file) {
        args.unshift(file)
    }

    if (declaration) {
        args.push("-d")
    }

    if (dDir) {
        args.push("--declarationDir", dDir)
    }

    if (!lib && !es) {
        spawnTsc(args)

        return
    }

    if (lib) {
        spawnTsc(
            [
                ...args,
                "-t",
                "ES5",
                "-m",
                "CommonJS",
                "--outDir",
                "./lib"
            ],
            "./lib"
        )
    }

    if (es) {
        spawnTsc(
            [
                ...args,
                "-t",
                "ESNEXT",
                "-m",
                "ESNext",
                "--outDir",
                "./es"
            ],
            "./es"
        )
    }
}

program
    .command("tsc [file]")
    .option("--init", "Init tsconfig.json")
    .option("--lib", "Build commonjs")
    .option("--es", "Build ESNext")
    .option("-d, --declaration", "Generate declaration files")
    .option("--dDir <dir>", "Output directory for generated declaration files")
    .action(action)
