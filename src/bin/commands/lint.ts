import {ESLint} from "eslint"
import {program} from "commander"
import getBaseConfig from "../../config/eslint/eslint"
import path from "path"

async function action(files: string[], cmd: any) {
    const {
        fix,
        config,
        eslintrc,
        ext,
        react,
        ts
    } = cmd
    let extensions = ext

    if (!ext) {
        if (ts) {
            extensions = [".ts"]
        } else {
            extensions = [".js"]
        }

        if (react) {
            extensions = [...extensions, `${extensions}x`]
        }
    }
    
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

program
    .command("lint <files...>")
    .option("--ext <extensions...>", "Extensions")
    .option("--fix", "Auto fix")
    .option("-c, --config <config>", "Disable use of configuration from .eslintrc.*")
    .option("--no-eslintrc", "Load .eslintrc.* files")
    .option("--no-react", "No react")
    .option("--no-ts", "Use javascript")
    .action(action)