"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
function getAbsPath(file) {
    if (!file) {
        return "";
    }
    if (path_1.default.isAbsolute(file)) {
        return file;
    }
    return path_1.default.join(process.cwd(), file);
}
exports.default = getAbsPath;
