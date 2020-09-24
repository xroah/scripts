const childProc = require("child_process")

module.exports = function spawn(dir, cmd, args, msg) {
    if (msg) {
        console.log()
        console.log(msg)
    }

    return new Promise((resolve, reject) => {
        const _reject = err => {
            if (rejected) {
                return
            }

            rejected = true

            reject(err)
        }
        const proc = childProc.spawn(
            cmd,
            args,
            {
                cwd: dir,
                stdio: "inherit",
                shell: true
            }
        )
        let rejected = false

        proc.on("close", (code, signal) => {
            if (code !== 0) {
                _reject(signal)

                return
            }

            resolve()
        })
        proc.on("error", _reject)
    })
}