const conf = require("./webpack.config");
const clean = require("./utils/clean");
const webpack = require("webpack");
const chalk = require("chalk");
const ora = require("ora");
const spinner = ora("Building");
const path = require("path");
const prodConf = conf("production");
const outputPath = prodConf.output.path || path.join(process.cwd(), "dist");

function resizeString(str, length) {
    const l = str.length;

    if (l >= length) {
        return str.substring(l, length + 1);
    }

    const restLen = length - l;

    return str + Array(restLen).fill(" ").join("");
}

function convertSize(size) {
    const BASE = 1024;
    const sizeKB = size / BASE;

    //Byte
    if (size < BASE) {
        return `${size}B`;
    }

    //KB
    if (sizeKB < BASE) {
        return `${Math.ceil(sizeKB)}KB`;
    }

    //MB
    return `${Math.ceil(sizeKB / Base)}MB`;
}

function statsAssets(assets)  {
    const js = [];
    const css = [];

    assets.forEach(asset => {
        const {
            name,
            size
        } = asset;
        const baseDir = path.resolve(__dirname, "..");
        const ext = path.extname(name);
        const filePath = outputPath + path.sep + name;
        const relativePath = path.relative(baseDir, filePath);
        const sizeStr = resizeString(convertSize(size), 10);
        const ret = "  " + sizeStr + path.normalize(relativePath);

        switch (ext) {
            case ".js":
                js.push(ret);
                break;
            case ".css":
                css.push(ret);
                break;
        }
    });

    console.log("File sizes: ");
    console.log();

    js.concat(css).forEach(str => {
        console.log(chalk.cyan(str));
    });

    console.log();
}

try {
    clean(outputPath);
} catch (error) {
    console.log(error);
}

spinner.start();

webpack(prodConf, (err, stats) => {
    if (err || stats.hasErrors()) {
        if (err) {
            throw err;
        }

        throw new Error();
    }

    spinner.stop();

    console.log(chalk.green("Built successfully"));
    console.log();

    statsAssets(stats.toJson().assets);
});