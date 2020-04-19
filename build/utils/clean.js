const fs = require("fs");
const path = require("path");

module.exports = function clean(dir) {
    let stat = fs.lstatSync(dir);

    if (stat.isDirectory(dir)) {
        const files = fs.readdirSync(dir);

        while (files.length) {
            const file = files.pop();
            const filePath = path.resolve(dir, file);

            clean(filePath);
        }

        fs.rmdirSync(dir);
    } else {
        fs.unlinkSync(dir);
    }
}