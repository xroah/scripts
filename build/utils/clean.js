const fs = require("fs");
const path = require("path");

module.exports = function clean(dir) {
    const absPath = path.resolve(dir);
    let stat;
    /**
     * readdirSync may read the files,
     * but statSync some files may cause error(does not exist),
     * however, the file can be deleted:
     * 
     * > fs.readdirSync("./node_modules/.bin")
        [ 'json5', 'loose-envify' ]
        > fs.statSync("./node_modules/.bin/json5")
        Uncaught Error: ENOENT: no such file or directory, stat './node_modules/.bin/json5'
            at Object.statSync (fs.js:982:3) {
        errno: -2,
        syscall: 'stat',
        code: 'ENOENT',
        path: './node_modules/.bin/json5'
        }
        > fs.unlink("./node_modules/.bin/json5")
     */

    try {
        stat = fs.statSync(absPath);
    } catch (error) {

    }

    if (!stat) {
        try {
            fs.unlinkSync(absPath);
        } catch (error) {
            
        }

        return;
    }

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