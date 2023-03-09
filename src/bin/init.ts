import yargs from "yargs"
import fs from "fs"
import path from "path"
import { SpawnOptions, spawnSync } from "child_process"
import chalk from "chalk"
import ora from "ora"
import getRootDir from "../utils/get-root-dir.js"

function installPackages(name: string) {
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
        cwd: path.join(process.cwd(), name),
        shell: true,
        stdio: ["ignore", "ignore", "inherit"]
    }
    const depSpinner = ora(chalk.cyan("Installing dependencies..."))
    const devDepSpinner = ora(chalk.cyan("Installing dev dependencies"))

    depSpinner.start()
    spawnSync(
        "npm",
        ["i", ...deps],
        options
    )
    depSpinner.stop()

    devDepSpinner.start()
    spawnSync(
        "npm",
        ["i", "-D", ...devDeps],
        options
    )
    devDepSpinner.stop()
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
    const dir = path.join(process.cwd(), name)

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }

    fs.writeFileSync(
        path.join(dir, "package.json"),
        JSON.stringify(packageJson, null, 4)
    )

    installPackages(name)
    copyTemplate(dir)

    console.log(chalk.green("Created successfully"))
}

function copyTemplate(dest: string) {
    const srcDir = path.join(getRootDir(), "template/react")
    let files = fs.readdirSync(srcDir)

    while (files.length) {
        const f = files.shift()!
        const absPath = path.join(srcDir, f)
        const stat = fs.statSync(absPath)

        if (stat.isDirectory()) {
            const dirFiles = fs.readdirSync(absPath).map(
                sub => path.join(f, sub)
            )
            files = files.concat(dirFiles)
            const destDir = path.join(dest, f)

            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(path.join(dest, f))
            }
        } else {
            fs.copyFileSync(
                absPath,
                path.join(dest, f)
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