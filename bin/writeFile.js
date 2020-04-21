const fs = require("fs");
const path = require("path");
let tsconfigJSON = {
    compilerOptions: {
        target: "ES6",
        module: "ESNext",
        jsx: "react",
        strict: true,
        moduleResolution: "node",
        esModuleInterop: true,
        forceConsistentCasingInFileNames: true
    },
    include: [
        "src/**/*"
    ],
    exclude: [
        "node_modules"
    ]
};
let packageJSON = {
    name: "",
    version: "1.0.0",
    scripts: {
        start: "node build/start",
        build: "node build/build"
    }
};
let babelConf = {
    presets: [
        "@babel/preset-env",
        "@babel/preset-react"
    ],
    plugins: [
        "react-hot-loader/babel",
        "@babel/plugin-transform-runtime",
        "@babel/plugin-proposal-class-properties"
    ]
};

module.exports = function writeFile(appDir, appName, useTypescript) {
    packageJSON.name = appName;

    //write package.json
    fs.writeFileSync(
        path.join(appDir, "package.json"),
        JSON.stringify(packageJSON, null, 4)
    )

    if (useTypescript) {
        babelConf.presets.push("@babel/preset-typescript");
        //write tsconfig.json
        fs.writeFileSync(
            path.join(appDir, "tsconfig.json"),
            JSON.stringify(tsconfigJSON, null, 4)
        );
    }

    //write .babelrc.json
    fs.writeFileSync(
        path.join(appDir, ".babelrc.json"),
        JSON.stringify(babelConf, null, 4)
    );
}