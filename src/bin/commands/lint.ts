import {ESLint} from "eslint"
import getBaseConfig from "../../config/eslint/eslint.js"
import getProjectRoot from "../../utils/get-project-root.js"
import program from "./program.js"

async function action(files: string[], cmd: any) {
    const {
        fix,
        config,
        eslintrc,
        ext,
        react,
        ts,
        resolvePluginsRelativeTo
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
        resolvePluginsRelativeTo: resolvePluginsRelativeTo || getProjectRoot()
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
    .option("--ext <extensions...>", "File extensions - default .ts,.tsx")
    .option("--fix", "Auto fix")
    .option("-c, --config <config>", "Use this configuration, overriding .eslintrc.* config options")
    .option("--no-eslintrc", "Disables use of configuration from .eslintrc.* and package.json files")
    .option("--no-react", "Do not lint .[jt]sx files")
    .option("--no-ts", "Lint javascript only")
    .option("--resolve-plugins-relative-to <path>", "A folder where plugins should be resolved from, the module(reap-scripts) directory by default")
    .action(action)
    .parse()