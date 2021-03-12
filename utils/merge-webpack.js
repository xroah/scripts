"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const html_webpack_plugin_1 = __importDefault(require("../config/webpack/html-webpack-plugin"));
const webpack_merge_1 = require("webpack-merge");
const html_webpack_plugin_2 = __importDefault(require("html-webpack-plugin"));
const load_config_1 = __importDefault(require("./load-config"));
const get_abs_path_1 = __importDefault(require("./get-abs-path"));
exports.default = (baseConf, configFile, ts, entry, index) => {
    let noHTMLPlugin = false;
    let htmlOptions = Object.assign({}, html_webpack_plugin_1.default);
    let devServer = {};
    let merged = Object.assign({}, baseConf);
    if (!ts) {
        merged.entry = get_abs_path_1.default("./src/index.jsx");
    }
    const customConfig = load_config_1.default(configFile);
    const htmlPluginOptions = customConfig.htmlWebpackPlugin;
    merged = webpack_merge_1.merge(baseConf, customConfig.webpack);
    if (htmlPluginOptions === false) {
        noHTMLPlugin = true;
    }
    else {
        htmlOptions = Object.assign(Object.assign({}, htmlOptions), htmlPluginOptions);
    }
    devServer = customConfig.devServer || {};
    if (entry) {
        merged.entry = get_abs_path_1.default(entry);
    }
    if (!noHTMLPlugin) {
        if (index) {
            htmlOptions.template = get_abs_path_1.default(index);
        }
        merged.plugins.push(new html_webpack_plugin_2.default(htmlOptions));
    }
    return {
        merged,
        devServer
    };
};
