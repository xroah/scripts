const fs = require("fs");
const path = require("path");

module.exports = function clean(dir) {
    const absPath = path.resolve(dir);
    let stat = fs.lstatSync(absPath);

    if (stat.isDirectory(absPath)) {
        const files = fs.readdirSync(absPath);

        while (files.length) {
            const file = files.pop();
            const filePath = path.resolve(absPath, file);

            clean(filePath);
        }

        fs.rmdirSync(absPath, {
            maxRetries: 5,
            retryDelay: 200
        });
    } else {
        fs.unlinkSync(absPath);
    }
}