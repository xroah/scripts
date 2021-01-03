#!/usr/bin/env node

const chalk = require("chalk")
const {program} = require("commander")
const path = require("path")
const package = require("../package.json")
const {
    deps,
    devDeps,
    tsDeps
} = require("./deps")
const {
    checkAppDir,
    initConfigFile,
    removeDirFactory,
    spawn
} = require("./utils")
let appName

program
    .version(
        package.version,
        "-v, --version",
        "show version"
    )
    .arguments("[app-name]")
    .option(
        "-t, --typescript",
        "use typescript in your project"
    )
    .option(
        "-g, --git",
        "init git"
    )
    .name("react-init")
    .usage("<app-name> [option]")
    .action(name => {
        if (name === undefined) {
            console.log(chalk.red("\nNo application name provided\n"))
            console.log(
                chalk.bold("For example:"),
                chalk.cyan("react-init "),
                chalk.green("<app-name>"),
                "\n"
            )

            process.exit(1)
        }

        appName = name
    })
    .parse(process.argv)

const appDir = checkAppDir(appName)
const removeAppDir = removeDirFactory(appDir)
const gitPromise = (
    program.git ?
        spawn(appDir, "git", ["init"]) : //init git
        Promise.resolve()
)

function install(dir, args, msg) {
    return spawn(dir, "npm", args, msg)
}

console.log(chalk.bold("This might take a few minutes."))

initConfigFile(
    path.resolve(__dirname, "../template"),
    appDir,
    appName,
    program.typescript
)

process
    .on("SIGTERM", removeAppDir)
    .on("SIGINT", removeAppDir)
    .on("exit", code => {
        if (code !== 0) {
            removeAppDir()
        }
    })

const commonArgs = ["--loglevel", "error"]
const depMsg = chalk.bold("Installing dependencies:")
const devDepMsg = chalk.bold("Installing dev dependencies:")

gitPromise
    //install dependencies
    .then(
        () => install(
            appDir,
            [
                "i",
                ...commonArgs,
                ...deps
            ],
            depMsg
        )
    )
    //install dev dependencies
    .then(
        () => install(
            appDir,
            [
                "i",
                "-D",
                ...commonArgs,
                ...devDeps,
                ...(program.typescript ? tsDeps : [])
            ],
            devDepMsg
        )
    )
    //print message
    .then(
        () => {
            console.log(chalk.green(`${appName} initialized successfully.`))
            console.log()
            console.log("Now you can run:")
            console.log()
            console.log(
                chalk.cyan(chalk.bold(`cd ${appName}`))
            )
            console.log(
                chalk.cyan(chalk.bold("npm start"))
            )
            console.log()
            console.log("Enjoy!")
            console.log()
        }
    )
    .catch(removeAppDir)