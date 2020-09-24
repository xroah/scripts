const childProc = require("child_process")
const processes = new Map()

exports.spawn = function spawn(dir, cmd, args, msg) {
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

            processes.delete(proc.pid)
            reject(err === "SIGINT" ? null : err)
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

        processes.set(proc.pid, proc)
        proc.on("close", (code, signal) => {
            processes.delete(proc.pid)

            if (code !== 0) {
                _reject(signal)

                return
            }

            resolve()
        })
        proc.on("error", _reject)
    })
}

exports.killProcess = function killProcess() {
    for (let [_, proc] of processes) {
        //if process still running, clean dirs may cause error(EBUSY)
        proc.kill("SIGINT")
    }
}