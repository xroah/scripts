#!/usr/bin/env node

const chalk = require("chalk")
const {program} = require("commander")
const path = require("path")
const spawn = require("./spawn");
const checkAppDir = require("./checkAppDir")
const clean = require("./clean")
const package = require("../package.json")
const copy = require("./copy")
const {
    initCfg,
    initPaths
} = require("./initCfg")
const {
    deps,
    devDeps,
    tsDeps
} = require("./deps");
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

if (appDir === false) {
    process.exit(1)
}

const gitPromise = (
    program.git ?
        spawn(appDir, "git", ["init"]) : //init git
        Promise.resolve()
)

console.log(chalk.bold("This might take a few minutes."))

function install(dir, args, msg) {
    return spawn(dir, "npm", args, msg)
}

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

process
    .on("SIGTERM", cleanAppDir)
    .on("SIGINT", cleanAppDir)
    .on("exit", code => {
        if (code !== 0) {
            cleanAppDir()
        }
    })

initCfg(appDir, appName, program.typescript)

const commonArgs = ["--loglevel", "error"]
const depMsg = chalk.bold("Installing dependencies:")
const devDepMsg = chalk.bold("Installing dev dependencies:")

gitPromise
    .then(() => (
        //install dependencies
        install(
            appDir,
            ["i"]
                .concat(commonArgs)
                .concat(deps),
            depMsg
        )
    ))
    .then(() => (
        //install dev dependencies
        install(
            appDir,
            ["i", "-D"]
                .concat(commonArgs)
                .concat(devDeps)
                .concat(program.typescript ? tsDeps : []),
            devDepMsg
        )
    ))
    .then(() => {
        const baseDir = path.resolve(__dirname, "../template")
        const srcDir = path.join(
            baseDir,
            "src",
            program.typescript ? "ts" : "js"
        )
        const buildDir = path.join(appName, "build")

        copy(path.join(baseDir, "build"), buildDir)
        copy(srcDir, path.join(appName, "src"))
        copy(path.join(baseDir, "public"), path.join(appName, "public"))
        initPaths(buildDir, program.typescript)

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
        if (err) {
            console.log(err)
        }

        cleanAppDir()
    })