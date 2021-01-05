import {ESLint} from "eslint"
import {program} from "commander"
import getBaseConfig from "../../config/eslint/eslint"
import ora from "ora"
import path from "path"

async function action(files: string[], cmd: any) {
    const reg = /,|\s/g
    const {
        fix,
        config,
        eslintrc,
        ext,
        react
    } = cmd
    const extensions = ext ? ext.toLowerCase().split(reg) : [".ts", ".tsx"]
    const loading = ora("Linting...")
    const lintTS = extensions.includes(".ts") || extensions.includes(".tsx")
    const eslint = new ESLint({
        useEslintrc: eslintrc,
        extensions,
        fix,
        cwd: process.cwd(),
        baseConfig: getBaseConfig(react, lintTS),
        overrideConfigFile: config,
        resolvePluginsRelativeTo: path.join(__dirname, "../..")
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
    .option("-c, --config <value>", "Disable use of configuration from .eslintrc.*")
    .option("--no-eslintrc", "Load .eslintrc.* files")
    .option("--no-react", "No react")
    .action(action)