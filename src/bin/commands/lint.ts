import {ESLint} from "eslint"
import {program} from "commander"
import eslintConfig from "../../config/eslint/eslint"
import ora from "ora"

async function action(files: string[], cmd: any) {
    const reg = /,|\s/g
    const {
        fix,
        config,
        eslintrc,
        ext
    } = cmd
    const loading = ora("Eslint is working...")

    const eslint = new ESLint({
        useEslintrc: eslintrc,
        extensions: ext ? ext.split(reg) : [".ts", ".tsx"],
        fix,
        cwd: process.cwd(),
        baseConfig: eslintConfig as any,
        overrideConfigFile: config
    })

    loading.start()

    try {
        const results = await eslint.lintFiles(files)
        const formatter = await eslint.loadFormatter("stylish")
        const resultText = formatter.format(results)

        if (fix) {
            ESLint.outputFixes(results)
        }

        loading.stop()
        console.log(resultText)
    } catch (error) {
        loading.stop()
        console.log(error)
    }
}

program
    .command("lint <files...>")
    .option("--ext <value>", "Extensions")
    .option("--fix", "Autofix")
    .option("-c, --config <value>", "Configuration file")
    .option("--eslintrc", "Load .eslintrc.* files")
    .action(action)