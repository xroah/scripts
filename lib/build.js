const webpack = require("webpack")
const chalk = require("chalk")
const ora = require("ora")
const spinner = ora("Building for production")
const path = require("path")
const rimraf = require("rimraf");

function resizeString(str, length) {
    const l = str.length

    if (l >= length) {
        return str.substring(l, length + 1)
    }

    const restLen = length - l

    return str + Array(restLen).fill(" ").join("")
}

function convertSize(size) {
    const BASE = 1024
    const sizeKB = size / BASE

    //Byte
    if (size < BASE) {
        return `${size}B`
    }

    //KB
    if (sizeKB < BASE) {
        return `${Math.ceil(sizeKB)}KB`
    }

    //MB
    return `${Math.ceil(sizeKB / Base)}MB`
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
        const filePath = outputPath + path.sep + name
        const relativePath = path.relative(process.cwd(), filePath)
        const sizeStr = resizeString(convertSize(size), 10)
        const ret = "  " + sizeStr + path.normalize(relativePath)
        switch (ext) {
            case ".js":
                js.push(chalk.green(ret))
                break
            case ".css":
                css.push(chalk.cyan(ret))
                break
        }
    })

    const files = [...js, ...css]

    console.log("File sizes: ")
    console.log()
    files.forEach(str => console.log(str))
    console.log()
    console.log("Other types of assets omitted")
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
        
        if (err || stats.hasErrors()) {
            if (err) {
                throw err
            }

            console.log(chalk.red("Failed to build."))
            console.log(
                stats.compilation.errors.map(e => e.message).join("\n\n")
            )

            return
        }

        console.log()
        console.log(chalk.green("Built successfully"))
        console.log()

        statsAssets(stats.toJson().assets, outputPath)
    })
}