"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (defaultConfig, customConfig) => {
    if (!customConfig) {
        return defaultConfig;
    }
    const { merge } = customConfig, restConfig = __rest(customConfig, ["merge"]);
    if (merge === false) {
        return restConfig;
    }
    const ret = Object.assign(Object.assign({}, restConfig), defaultConfig);
    ret.presets = defaultConfig.presets.concat(restConfig.presets || []);
    ret.plugins = defaultConfig.plugins.concat(restConfig.plugins || []);
    if (restConfig.runtime !== false) {
        ret.plugins.push(require.resolve("@babel/plugin-transform-runtime"));
    }
    return ret;
};
