import yargs from "yargs"
import {
    existsSync,
    readdirSync,
    mkdirSync,
    writeFileSync,
    statSync,
    copyFileSync
} from "fs"
import { join as joinPath } from "node:path"
import { SpawnOptions, spawnSync } from "node:child_process"
import chalk from "chalk"
import ora from "ora"
import rm from "../utils/rm.js"
import { getRootDir } from "../utils/path-utils.js"

function installPackages(cwd: string) {
    const deps = [
        "react",
        "react-dom",
        "react-router-dom"
    ]
    const devDeps = [
        "@types/react",
        "@types/react-dom",
        "@typescript-eslint/eslint-plugin",
        "@typescript-eslint/parser",
        "eslint",
        "eslint-plugin-react",
        "sass",
        "typescript"
    ]
    const options: SpawnOptions = {
        cwd,
        stdio: "inherit",
        shell: true
    }
    const depSpinner = ora(chalk.cyan("Installing dependencies..."))
    const devDepSpinner = ora(chalk.cyan("Installing dev dependencies"))

    depSpinner.start()
    const depProc = spawnSync(
        "npm",
        ["i", ...deps],
        options
    )
    depSpinner.stop()

    if (depProc.status !== 0 || depProc.error) {
        return false
    }

    devDepSpinner.start()

    const devDepProc = spawnSync(
        "npm",
        ["i", "-D", ...devDeps],
        options
    )
    devDepSpinner.stop()

    if (devDepProc.status !== 0 || devDepProc.error) {
        return false
    }

    return true
}

function rmDir(dir: string) {
    try {
        rm(dir)
    } catch (error) {
        console.log(error)
    }
}

function create(name: string) {
    const packageJson = {
        name,
        version: "1.0.0",
        description: "",
        "main": "index.js",
        scripts: {
            test: "echo \"Error: no test specified\" && exit 1",
            serve: "r-scripts serve",
            build: "r-script build",
            lint: "eslint src/**/*.ts"
        },
        author: "",
        license: ""
    }
    const dir = joinPath(process.cwd(), name)

    if (existsSync(dir) && readdirSync(dir).length) {
        console.log(
            chalk.red("The directory is not empty, please try another。")
        )

        return
    }

    process.on("exit", code => {
        if (code !== 0) {
            rmDir(dir)
        }
    })

    if (!existsSync(dir)) {
        mkdirSync(dir)
    }

    writeFileSync(
        joinPath(dir, "package.json"),
        JSON.stringify(packageJson, null, 4)
    )
    copyTemplate(dir)

    if (!installPackages(dir)) {
        return rmDir(dir)
    }

    console.log(chalk.green("Created successfully"))
}

function copyTemplate(dest: string) {
    const srcDir = joinPath(getRootDir(), "template/react")
    let files = readdirSync(srcDir)

    while (files.length) {
        const f = files.shift()!
        const absPath = joinPath(srcDir, f)
        const stat = statSync(absPath)

        if (stat.isDirectory()) {
            const dirFiles = readdirSync(absPath).map(
                sub => joinPath(f, sub)
            )
            files = files.concat(dirFiles)
            const destDir = joinPath(dest, f)

            if (!existsSync(destDir)) {
                mkdirSync(joinPath(dest, f))
            }
        } else {
            copyFileSync(
                absPath,
                joinPath(dest, f)
            )
        }
    }
}

// init react app
export default function createInitCommand(y: typeof yargs) {
    y.command(
        "init <name>",
        "Create react app",
        {},
        argv => create(argv.name as string)
    )
}