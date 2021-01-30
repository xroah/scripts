import webpack from "webpack"
import chalk from "chalk"
import ora from "ora"
import path from "path"
import resizeString from "./utils/resize-string"

const spinner = ora("Building for production")

function convertSize(size: number) {
    const BASE = 1024
    const sizeKB = size / BASE
    const toFixed = (n: number) => n.toFixed(2)

    //Byte
    if (size < BASE) {
        return `${size}B`
    }

    //KB
    if (sizeKB < BASE) {
        return `${toFixed(sizeKB)}KB`
    }

    //MB
    return `${toFixed(sizeKB / BASE)}MB`
}

function statsAssets(assets: any[], outputPath: string) {
    const js: string[] = []
    const css: string[] = []

    assets.forEach(asset => {
        const {
            name,
            size
        } = asset
        const ext = path.extname(name)
        const filePath = `${outputPath}${path.sep}${name}`
        const relativePath = path.relative(process.cwd(), filePath)
        const sizeStr = resizeString(convertSize(size), 12)
        const ret = `${sizeStr}${path.normalize(relativePath)}`
        switch (ext) {
            case ".js":
                js.push(chalk.yellow(ret))
                break
            case ".css":
                css.push(chalk.cyan(ret))
                break
        }
    })

    console.log("File sizes: ")
    console.log()
    js.concat(css).forEach(str => console.log(str))
    console.log()
    console.log("Other types of assets omitted.")
    console.log()
}

export = (webpackConfig: webpack.Configuration) => {
    const outputPath = webpackConfig.output!.path || path.join(process.cwd(), "dist")

    spinner.start()

    webpack(webpackConfig, (err: any, stats) => {
        spinner.stop()

        if (err) {
            console.log(err.stack || err)

            if (err.details) {
                console.log(err.details)
            }

            return
        }

        if (stats) {
            if (stats.hasErrors()) {
                console.log(chalk.red("Failed to build."))
                console.log(
                    stats.toJson().errors.map((e: any) => e.message).join("\n\n")
                )

                return
            }

            statsAssets(stats.toJson().assets, outputPath)
        }

        console.log()
        console.log(chalk.green("Built successfully"))
        console.log()
    })
}