const fs = require("fs");
const path = require("path");

function copyDir(source, target) {
    const files = fs.readdirSync(source);

    if (!fs.existsSync(target)) {
        fs.mkdirSync(target);
    }

    while (files.length) {
        const file = files.pop();
        const filePath = path.join(source, file);
        const stat = fs.statSync(filePath);
        const dest = path.join(target, file);

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
    const file = path.join(target, srcObj.base);

    _copyFile(source, file);
}

module.exports = function copy(source, target) {
    if (Array.isArray(source)) {
        if (fs.existsSync(target)) {
            if (!fs.statSync(target).isDirectory()) {
                throw new Error(
                    "The second param is not a directory"
                );
            }
        } else {
            fs.mkdirSync(target);
        }

        return source.forEach(
            src => {
                const base = path.parse(src).base;

                copy(
                    src,
                    path.join(target, base)
                );
            }
        );
    }

    if (source && fs.existsSync(source)) {
        const stat = fs.statSync(source);

        (
            stat.isDirectory() ?
                copyDir : copyFile
        )(source, target);
    }
}