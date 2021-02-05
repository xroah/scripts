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
const copy = require("./copy")

function babelConf(useTypescript) {
    const presets = [
        '"@babel/preset-env"',
        '"@babel/preset-react"',
        useTypescript && '"@babel/preset-typescript"'
    ].filter(Boolean)

    return `api => {
    const isDev = api.env("development")
    const conf = {
        presets: [
            ${presets.join(",\n\t\t\t")}
        ],
        plugins: [
            "@babel/plugin-transform-runtime",
            "@babel/plugin-proposal-class-properties"
        ]
    }

    if (isDev) {
        conf.plugins.push("react-refresh/babel")
    }

    return conf
}`
}

module.exports = function initConfigFile(baseDir, appDir, appName, useTypescript) {
    const babelFunStr = `module.exports = ${babelConf(useTypescript).toString()}`
    //confg/app.config.js
    const appConfig = `module.exports = {
    appIndex: "${useTypescript ? "./src/index.tsx" : "./src/index.jsx"}",
    typescript: ${useTypescript}
}`
    const srcDir = path.join(
        baseDir,
        "src",
        useTypescript ? "ts" : "js"
    )
    const buildDir = path.join(appName, "build")
    packageJSON.name = appName

    //write package.json
    fs.writeFileSync(
        path.join(appDir, "package.json"),
        JSON.stringify(packageJSON, null, 4)
    )

    if (useTypescript) {
        //copy tsconfig.json
        fs.copyFileSync(
            path.join(__dirname, "../../template/tsconfig.json"),
            path.join(appDir, "tsconfig.json")
        )
    }

    //write babel.config.js
    fs.writeFileSync(
        path.join(appDir, "babel.config.js"),
        babelFunStr
    )
    //copy build dir
    copy(path.join(baseDir, "build"), buildDir)
    //copy src dir
    copy(srcDir, path.join(appName, "src"))
    //copy public dir
    copy(path.join(baseDir, "public"), path.join(appName, "public"))
    //create app.config.js
    fs.writeFileSync(path.join(buildDir, "config/app.config.js"), appConfig)
}