const webpack = require("webpack")
const chalk = require("chalk")
const ora = require("ora")
const spinner = ora("Building for production")
const path = require("path")
const rimraf = require("rimraf");
const {
    clearConsole,
    resizeString
} = require("./utils")

function convertSize(size) {
    const BASE = 1024
    const sizeKB = size / BASE
    const toFixed = size => size.toFixed(2)

    //Byte
    if (size < BASE) {
        return `${size}B`
    }

    //KB
    if (sizeKB < BASE) {
        return `${toFixed(sizeKB)}KB`
    }

    //MB
    return `${toFixed(sizeKB / Base)}MB`
}

function statsAssets(assets, outputPath) {
    const js = []
    const css = []

    assets.forEach(asset => {
        const {
            name,
            size
        } = asset
        const ext = path.extname(name)
        const filePath = `${outputPath}${path.sep}${name}`
        const relativePath = path.relative(process.cwd(), filePath)
        const sizeStr = resizeString(convertSize(size), 15)
        const ret = `   ${sizeStr}${path.normalize(relativePath)}`
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

module.exports = function build(webpackConfig) {
    const outputPath = webpackConfig.output.path || path.join(process.cwd(), "dist")

    spinner.start()

    try {
        rimraf.sync(outputPath)
    } catch (error) {
        console.log(error)
    }

    webpack(webpackConfig, (err, stats) => {
        spinner.stop()

        if (err) {
            console.log(err.stack || err)

            if (err.details) {
                console.log(err.details)
            }

            return
        }

        if (stats.hasErrors()) {
            console.log(chalk.red("Failed to build."))
            console.log(
                stats.toJson().errors.map(e => e.stack).join("\n\n")
            )

            return
        }

        console.log()
        clearConsole()
        console.log(chalk.green("Built successfully"))
        console.log()

        statsAssets(stats.toJson().assets, outputPath)
    })
}