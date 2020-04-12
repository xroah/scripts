#!/usr/bin/env node

const chalk = require("chalk");
const { program } = require("commander");
const path = require("path");
const checkAppDir = require("./checkAppDir");
const package = require("../package.json");
const copy = require("./copy");
const clean = require("../build/utils/clean");
const install = require("./install");
const writeFile = require("./writeFile");
let deps = require("../dependencies/dep");
let devDeps = require("../dependencies/dev");
let tsDeps = require("../dependencies/ts");
let appName;
let useTypescript = false;
let dirCleaning = false;//in case clean dir repetitively

program.version(
    package.version,
    "-v, --version",
    "show version"
)
    .arguments("[app-name]")
    .option(
        "-t, --typescript",
        "use typescript in your project"
    )
    .action((name, cmdObj) => {
        appName = name;
        useTypescript = !!cmdObj.typescript;
    })
    .name("react-init")
    .usage("<app-name> [option]")
    .parse(process.argv)

if (appName === undefined) {
    console.log(chalk.red("\nNo application name provided\n"));
    console.log(
        chalk.bold("For example:"),
        chalk.cyan("react-init "),
        chalk.green("<app-name>"),
        "\n"
    );

    process.exit(1);
}

const appDir = checkAppDir(appName);
const baseDir = path.resolve(__dirname, "..");
const dirs = [
    path.join(baseDir, "build"),
    path.join(baseDir, "template", "public")
];

dirs.push(
    path.join(
        baseDir,
        "template",
        useTypescript ? "ts" : "js",
        "src"
    )
);

console.log(
    chalk.bold("Installing packages, this might take a few minutes.")
)

function cleanAppDir() {
    if (dirCleaning) return;

    dirCleaning = true;

    clean(appDir);
}

process.on("SIGINT", () => {
    process.exit(1);
}).on("exit", code => {
    if (code !== 0) {
        cleanAppDir();
    }
});

const commonArgs = ["--loglevel", "error"];
const msg1 = chalk.bold("Installing dependencies:");
const msg2 = chalk.bold("Installing dev dependencies:");

writeFile(appDir, appName, useTypescript);

//install dependencies
install(
    appDir,
    ["i"]
        .concat(commonArgs)
        .concat(deps),
    msg1
).then(() => {
    //install dev dependencies
    return install(
        appDir,
        ["i", "-D"]
            .concat(commonArgs)
            .concat(devDeps)
            .concat(useTypescript ? tsDeps : []),
        msg2
    )
}).then(() => {
    copy(dirs, appDir);

    console.log(chalk.green(`Initialized ${appName} successfully.`));
    console.log();
    console.log("Now you can run:");
    console.log();
    console.log(
        chalk.cyan(
            chalk.bold(`cd ${appName}`)
        )
    );
    console.log(
        chalk.cyan(
            chalk.bold("npm start")
        )
    );
    console.log();
    console.log("Enjoy!");
    console.log();
}).catch(() => {
    cleanAppDir();
});