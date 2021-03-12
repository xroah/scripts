"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_1 = require("typescript");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const get_abs_path_1 = __importDefault(require("./get-abs-path"));
const cacheDir = path_1.default.join(__dirname, "../../", ".cache");
if (!fs_1.default.existsSync(cacheDir)) {
    fs_1.default.mkdirSync(cacheDir);
}
exports.default = (filename) => {
    const source = fs_1.default.readFileSync(get_abs_path_1.default(filename)).toString();
    const { name } = path_1.default.parse(filename);
    const outputFilename = path_1.default.join(cacheDir, `${name}.js`);
    const result = typescript_1.transpileModule(source, { compilerOptions: { module: typescript_1.ModuleKind.CommonJS } });
    fs_1.default.writeFileSync(outputFilename, result.outputText.toString());
    process.nextTick(() => {
        try {
            fs_1.default.unlinkSync(outputFilename);
        }
        catch (error) {
        }
    });
    return outputFilename;
};
