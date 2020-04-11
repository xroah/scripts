const conf = require("./webpack.config");
const clean = require("./utils/clean");
const webpack = require("webpack");
const chalk = require("chalk");
const ora = require("ora");
const spinner = ora("building");

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