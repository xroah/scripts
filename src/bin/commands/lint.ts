import {ESLint} from "eslint"
import {program} from "commander"
import eslintConfig from "../../config/eslint/eslint"

const lint = program.command("lint <file>")

async function action(file: string, cmd: any) {
    const reg = /,|\s/g
    const files = file.split(reg)
    const {
        fix,
        config,
        userc
    } = cmd
    let ext = cmd.ext

    if (ext) {
        ext = ext.split(reg)
    } else {
        ext = [".ts", ".tsx"]
    }

    const eslint = new ESLint({
        useEslintrc: userc,
        extensions: ext,
        fix,
        cwd: process.cwd(),
        baseConfig: eslintConfig as any,
        overrideConfigFile: config
    })

    try {
        const results = await eslint.lintFiles(files)
        const formatter = await eslint.loadFormatter("stylish")
        const resultText = formatter.format(results)

        if (fix) {
            ESLint.outputFixes(results)
        }

        console.log(resultText)
    } catch (error) {
        console.log(error)
    }
}

lint.option("--ext <value>", "Extensions")
    .option("--fix", "Autofix")
    .option("-c, --config <value>", "Configuration file")
    .option("--userc", "Load .eslintrc.* files")
    .action(action)