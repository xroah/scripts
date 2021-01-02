const fs = require("fs")
const path = require("path")
const packageJSON = {
    name: "",
    version: "1.0.0",
    scripts: {
        start: "node build/start",
        build: "node build/build"
    }
}
const BABEL_PRESETS_PLACEHOLDER = "BABEL_PRESETS_PLACEHOLDER"
const babelPresets = ["@babel/preset-env", "@babel/preset-react"]

function babelConf(api) {
    const isDev = api.env("development")
    const cfg = {
        presets: BABEL_PRESETS_PLACEHOLDER,
        plugins: ["@babel/plugin-transform-runtime", "@babel/plugin-proposal-class-properties"]
    }

    if (isDev) {
        cfg.plugins.push("react-refresh/babel")
    }

    return cfg
}

exports.initCfg = function initCfg(appDir, appName, useTypescript) {
    const babelFunStr = `module.exports = ${babelConf.toString()}`
    packageJSON.name = appName

    //write package.json
    fs.writeFileSync(
        path.join(appDir, "package.json"),
        JSON.stringify(packageJSON, null, 4)
    )

    if (useTypescript) {
        babelPresets.push("@babel/preset-typescript")
        //copy tsconfig.json
        fs.copyFileSync(
            path.join(__dirname, "../template/tsconfig.json"),
            path.join(appDir, "tsconfig.json")
        )
    }

    //write babel.config.js
    fs.writeFileSync(
        path.join(appDir, "babel.config.js"),
        babelFunStr.replace(
            BABEL_PRESETS_PLACEHOLDER,
            JSON.stringify(babelPresets)
        )
    )
}

exports.createCfgFile = function createCfgFile(dir, useTypescript) {
    const code = `
module.exports = {
    appIndex: "${useTypescript ? "./src/index.tsx" : "./src/index.jsx"}",
    typescript: ${useTypescript}
}
    `;

    fs.writeFileSync(path.join(dir, "config/app.config.js"), code);
}