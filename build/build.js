const conf = require("./webpack.config");
const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const chalk = require("chalk");
const ora = require("ora");
const spinner = ora("building");

function clean(dir) {
    if (!fs.existsSync(dir)) return;

    const absPath = path.resolve(dir);
    const stats = fs.statSync(absPath);

    if (stats.isDirectory(absPath)) {
        const files = fs.readdirSync(absPath);

        if (!files.length) {
            fs.rmdirSync(absPath);
        }

        while (files.length) {
            const file = files.pop();
            const filePath = path.resolve(absPath, file);

            clean(filePath);
        }
    } else {
        fs.unlinkSync(absPath);
    }
}

const prodConf = conf("production");

try {
    clean(prodConf.output.path);
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

    console.log();
    console.log(chalk.green("Built successfully"));
});