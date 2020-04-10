const fs = require("fs");
const path = require("path");

function copyDir(source, target) {
    if (
        !fs.existsSync(target) ||
        fs.statSync(target).isFile()
    ) {
        fs.mkdirSync(target);
    }

    const files = fs.readdirSync(source);

    while(files.length) {
        const file = files.pop();
        const filePath = path.resolve(source, file);
        const stat = fs.statSync(filePath);
        const dest = path.resolve(target, file);

        if (stat.isFile()) {
            fs.copyFileSync(filePath, dest);
        } else {
            copyDir(filePath, dest);
        }
    }
}

function copyFile(source, target) {
    const _copyFile = (src, dest) => {
        fs.copyFileSync(src, dest);
    };

    if (!fs.existsSync(target)) {
        return _copyFile(source, target);
    }

    const stat = fs.statSync(target);

    if (stat.isDirectory()) {
        const srcObj = path.parse(source);
        const file = path.resolve(target, srcObj.base);

        _copyFile(source, file);
    } else {
        _copyFile(source, target);
    }
}

module.exports = function copy(source, target) {
    const absSrc = path.resolve(source);
    const absTgt = path.resolve(target);

    if (!fs.existsSync(absSrc)) return;

    const stat = fs.statSync(absSrc);

    if (stat.isDirectory()) {
        copyDir(absSrc, absTgt);
    } else {
        copyFile(absSrc, absTgt);
    }
}