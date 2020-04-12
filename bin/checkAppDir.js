const fs = require("fs");
const path = require("path");

module.exports = function checkAppDir(appName) {
    const cwd = process.cwd();
    const appDir = path.join(cwd, appName);

    if (
        !fs.existsSync(appDir) ||
        !fs.statSync(appDir).isDirectory()
    ) {
        fs.mkdirSync(appDir);
    } else {
        const files = fs.readdirSync(appDir);
        let valid = true;

        for (let file of files) {
            const stat = fs.statSync(path.join(appDir, file));
            //directory name does not start with "." or
            //package.json already exists
            if (
                (!/^\./.test(file) && stat.isDirectory()) ||
                file === "package.json"
            ) {
                valid = false;
                break;
            }
        }

        if (!valid) {
            throw new Error(
                `The ${appName} directory already exists, please try another.`
            );
        }
    }

    return appDir;
}