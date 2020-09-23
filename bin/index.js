#!/usr/bin/env node

const chalk = require("chalk")
const {program} = require("commander")
const spawn = require("./spawn");
const path = require("path")
const checkAppDir = require("./checkAppDir")
const package = require("../package.json")
const copy = require("./copy")
const clean = require("../build/utils/clean")
const initBabelPackageTS = require("./initBabelPackageTS")
const {deps, devDeps, tsDeps} = require("./deps");
let appName
let dirCleaning = false//in case clean dir repetitively

program
    .version(
        package.version,
        "-v, --version",
        "show version"
    )
    .arguments("[app-name]")
    .action(name => {
        appName = name
    })
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
    .parse(process.argv)

if (appName === undefined) {
    console.log(chalk.red("\nNo application name provided\n"))
    console.log(
        chalk.bold("For example:"),
        chalk.cyan("react-init "),
        chalk.green("<app-name>"),
        "\n"
    )

    process.exit(1)
}

const appDir = checkAppDir(appName)
const baseDir = path.resolve(__dirname, "..")
const dirs = [
    path.join(baseDir, "build"),
    path.join(baseDir, "template", "public")
]

if (appDir === false) {
    process.exit(1)
}

dirs.push(
    path.join(
        baseDir,
        "template",
        program.typescript ? "ts" : "js",
        "src"
    )
)

console.log(chalk.bold("This might take a few minutes."))

function cleanAppDir() {
    if (dirCleaning) return

    dirCleaning = true

    //may cause error on windows:
    //Error: EBUSY: resource busy or locked
    try {
        clean(appDir)
    } catch (error) {

    }
}

process.on("SIGINT", () => {
    process.exit(1)
}).on("exit", code => {
    if (code !== 0) {
        cleanAppDir()
    }
})

const commonArgs = ["--loglevel", "error"]
const msg1 = chalk.bold("Installing dependencies:")
const msg2 = chalk.bold("Installing dev dependencies:")

initBabelPackageTS(appDir, appName, program.typescript)

function install(dir, args, msg) {
    return spawn(dir, "npm", args, msg)
}

(
    program.git ?
        spawn(appDir, "git", ["init"]) : //init git
        Promise.resolve()
)
    .then(() => {
        //install dependencies
        return install(
            appDir,
            ["i"]
                .concat(commonArgs)
                .concat(deps),
            msg1
        )
    }).then(() => {
        //install dev dependencies
        return install(
            appDir,
            ["i", "-D"]
                .concat(commonArgs)
                .concat(devDeps)
                .concat(program.typescript ? tsDeps : []),
            msg2
        )
    }).then(() => {
        copy(dirs, appDir)

        console.log(chalk.green(`${appName} initialized successfully.`))
        console.log()
        console.log("Now you can run:")
        console.log()
        console.log(
            chalk.cyan(
                chalk.bold(`cd ${appName}`)
            )
        )
        console.log(
            chalk.cyan(
                chalk.bold("npm start")
            )
        )
        console.log()
        console.log("Enjoy!")
        console.log()
    }).catch(err => {
        console.error(err)
        cleanAppDir()
    })