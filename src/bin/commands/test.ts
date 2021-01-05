import {program} from "commander"
import path from "path"
import defaultJestConf from "../../config/jest/jest.config"
import {run as runTest} from "jest"

process.env.NODE_ENV = "test"
process.env.BABEL_ENV = "test"

function action(file: string, cmd: any) {
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
    const args = ["--config", JSON.stringify(mergedJestConf)]

    for (let key in cmd) {
        if (Object.prototype.hasOwnProperty.call(cmd, key)) {
            if (cmdBoolArgs.has(key)) {
                args.push(`--${key}`)
            } else if (cmdValueArgs.has(key)) {
                args.push(`--${key}`, cmd[key])
            }
        }
    }

    if (file) {
        args.unshift(file)
    }

    runTest(args)
}

program
    .command("test [file]")
    .option("--coverage", "Test coverage information")
    .option("--env <value>", "The test environment used for all tests")
    .option("--json", "Prints the test results in JSON")
    .option("-o, --outputFile <value>", "Write test results to a file when the --json option is also specified")
    .option("--verbose", "Display individual test results with the test suite hierarchy")
    .action(action)