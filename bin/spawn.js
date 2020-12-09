const childProc = require("child_process")
const processes = new Map()
const SIGINT = "SIGINT"

exports.SIGINT = SIGINT

function removeProc(proc) {
    processes.delete(proc.pid)
}

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

            removeProc(proc.pid)
            reject(err)
        }
        const _resolve = () => {
            if (resolved) {
                return
            }

            resolved = true

            resolve()
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
        let resolved = false

        processes.set(proc.pid, proc)
        proc.on("close", code => {
            removeProc(proc.pid)

            if (code !== 0) {
                _reject({
                    err: null,
                    proc
                })

                return
            }

            _resolve()
        }) 
        
        proc.on("exit", code => {
            if (code !== 0) {
                _reject({
                    err: null,
                    proc
                })

                return
            }

            _resolve()
        })
        proc.on("error", err => {
            _reject({
                err: err,
                proc
            })
        })
    })
}

exports.killProcess = function killProcess() {
    for (let [_, proc] of processes) {
        //if process still running, clean dirs may cause error(EBUSY)
        proc.kill(SIGINT)
        removeProc(proc.pid)
    }
}