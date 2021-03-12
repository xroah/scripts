"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const get_abs_path_1 = __importDefault(require("./get-abs-path"));
const transpile_ts_1 = __importDefault(require("./transpile-ts"));
function handleRequireTS(configFile) {
    const config = require(transpile_ts_1.default(configFile)) || {};
    return config.default ? config.default : config;
}
exports.default = (configFile) => {
    const DEFAULT_CONF_NAME = "reap.config";
    const defaultConfFileJS = get_abs_path_1.default(`${DEFAULT_CONF_NAME}.js`);
    const defaultConfFileTS = get_abs_path_1.default(`${DEFAULT_CONF_NAME}.ts`);
    const pkgJSON = get_abs_path_1.default("package.json");
    let config = {};
    if (configFile) {
        configFile = get_abs_path_1.default(configFile);
        if (path_1.default.extname(configFile) === ".ts") {
            config = handleRequireTS(configFile);
        }
        else {
            config = require(configFile);
        }
    }
    else if (fs_1.default.existsSync(defaultConfFileJS)) {
        config = require(defaultConfFileJS);
    }
    else if (fs_1.default.existsSync(defaultConfFileTS)) {
        config = handleRequireTS(defaultConfFileTS);
    }
    else if (fs_1.default.existsSync(pkgJSON)) {
        config = require(pkgJSON).reap;
    }
    return config || {};
};
