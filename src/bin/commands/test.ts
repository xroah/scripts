import {program} from "commander"
import path from "path"
import defaultJestConf from "../../config/jest/jest.config"
import {run as runTest} from "jest"
import setEnv from "../../utils/set-env"

function action(files: string, cmd: any) {
    const packageJSON = require(path.join(process.cwd(), "package.json"))
    const jestConf = packageJSON.jest || {}
    const mergedJestConf: any = {
        ...defaultJestConf,
        ...jestConf
    }
    const cmdBoolArgs = new Set([
        "coverage",
        "json",
        "verbose"
    ])
    const cmdValueArgs = new Set(["env", "outputFile"])
    let args = ["--config", JSON.stringify(mergedJestConf)]

    for (let key in cmd) {
        if (Object.prototype.hasOwnProperty.call(cmd, key)) {
            if (cmdBoolArgs.has(key)) {
                args.push(`--${key}`)
            } else if (cmdValueArgs.has(key)) {
                args.push(`--${key}`, cmd[key])
            }
        }
    }

    if (files) {
        args = [...files, ...args]
    }

    setEnv("test")
    runTest(args)
}

program
    .command("test [files...]")
    .option("--coverage", "Test coverage information")
    .option("--env <environment>", "The test environment used for all tests")
    .option("--json", "Prints the test results in JSON")
    .option("-o, --outputFile <outputFile>", "Write test results to a file when the --json option is also specified")
    .option("--verbose", "Display individual test results with the test suite hierarchy")
    .action(action)