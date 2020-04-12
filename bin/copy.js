const fs = require("fs");
const path = require("path");

function isDirectory(dir) {
    if (!fs.existsSync(dir)) {
        return false;
    }

    return fs.statSync(dir).isDirectory();
}

function copyDir(source, target) {
    const files = fs.readdirSync(source);

    if (!isDirectory(target)) {
        fs.mkdirSync(target);
    }

    while (files.length) {
        const file = files.pop();
        const filePath = path.resolve(source, file);
        const stat = fs.statSync(filePath);
        const dest = path.resolve(target, file);

        if (stat.isDirectory()) {
            copyDir(filePath, dest);
        } else {
            fs.copyFileSync(filePath, dest);
        }
    }
}

function copyFile(source, target) {
    const _copyFile = (src, dest) => {
        fs.copyFileSync(src, dest);
    };

    if (
        !fs.existsSync(target) ||
        !fs.statSync(target).isDirectory()
    ) {
        return _copyFile(source, target);
    }
    //copy source file to the target directory
    const srcObj = path.parse(source);
    const file = path.resolve(target, srcObj.base);

    _copyFile(source, file);
}

module.exports = function copy(source, target) {
    const absTgt = path.resolve(target);

    if (Array.isArray(source)) {
        if (fs.existsSync(absTgt)) {
            if (!fs.statSync(absTgt).isDirectory()) {
                throw new Error(
                    "The second param is not a directory"
                );
            }
        } else {
            fs.mkdirSync(absTgt);
        }

        return source.forEach(
            src => {
                const base = path.parse(src).base;

                copy(
                    path.resolve(src),
                    path.resolve(absTgt, base)
                );
            }
        );
    }

    const absSrc = path.resolve(source);

    if (source && fs.existsSync(absSrc)) {
        const stat = fs.statSync(absSrc);

        (
            stat.isDirectory() ?
                copyDir : copyFile
        )(absSrc, absTgt);
    }
}