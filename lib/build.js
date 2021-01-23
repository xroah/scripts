"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = __importDefault(require("webpack"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const path_1 = __importDefault(require("path"));
const resize_string_1 = __importDefault(require("./utils/resize-string"));
const spinner = ora_1.default("Building for production");
function convertSize(size) {
    const BASE = 1024;
    const sizeKB = size / BASE;
    const toFixed = (n) => n.toFixed(2);
    if (size < BASE) {
        return `${size}B`;
    }
    if (sizeKB < BASE) {
        return `${toFixed(sizeKB)}KB`;
    }
    return `${toFixed(sizeKB / BASE)}MB`;
}
function statsAssets(assets, outputPath) {
    const js = [];
    const css = [];
    assets.forEach(asset => {
        const { name, size } = asset;
        const ext = path_1.default.extname(name);
        const filePath = `${outputPath}${path_1.default.sep}${name}`;
        const relativePath = path_1.default.relative(process.cwd(), filePath);
        const sizeStr = resize_string_1.default(convertSize(size), 15);
        const ret = `   ${sizeStr}${path_1.default.normalize(relativePath)}`;
        switch (ext) {
            case ".js":
                js.push(chalk_1.default.yellow(ret));
                break;
            case ".css":
                css.push(chalk_1.default.cyan(ret));
                break;
        }
    });
    console.log("File sizes: ");
    console.log();
    js.concat(css).forEach(str => console.log(str));
    console.log();
    console.log("Other types of assets omitted.");
    console.log();
}
exports.default = (webpackConfig) => {
    const outputPath = webpackConfig.output.path || path_1.default.join(process.cwd(), "dist");
    spinner.start();
    webpack_1.default(webpackConfig, (err, stats) => {
        spinner.stop();
        if (err) {
            console.log(err.stack || err);
            if (err.details) {
                console.log(err.details);
            }
            return;
        }
        if (stats) {
            if (stats.hasErrors()) {
                console.log(chalk_1.default.red("Failed to build."));
                console.log(stats.toJson().errors.map((e) => e.stack).join("\n\n"));
                return;
            }
            statsAssets(stats.toJson().assets, outputPath);
        }
        console.log();
        console.log(chalk_1.default.green("Built successfully"));
        console.log();
    });
};
