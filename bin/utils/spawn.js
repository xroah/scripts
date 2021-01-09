const crossSpawn = require("cross-spawn")

module.exports = function spawn(dir, cmd, args, msg) {
    if (msg) {
        console.log()
        console.log(msg)
    }

    return new Promise((resolve, reject) => {
        let rejected = false
        let resolved = false
        const rejectPromise = err => {
            if (!rejected) {
                rejected = true

                reject(err)
            }
        }
        const resolvePromise = () => {
            if (!resolved) {
                resolved = true

                resolve()
            }
        }
        const proc = crossSpawn(
            cmd,
            args,
            {
                cwd: dir,
                stdio: "inherit",
                shell: true
            }
        )
        const handleExit = code => {
            if (code !== 0) {
                return rejectPromise()
            }

            resolvePromise()
        }

        proc
            .on("close", handleExit)
            .on("exit", handleExit)
            .on("error", rejectPromise)
    })
}