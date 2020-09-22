const childProc = require("child_process")

module.exports = function spawn(dir, cmd, args, msg) {
    if (msg) {
        console.log()
        console.log(msg)
    }

    return new Promise((resolve, reject) => {

        const proc = childProc.spawn(
            cmd,
            args,
            {
                cwd: dir,
                stdio: "inherit",
                shell: true
            }
        )

        proc.on("close", code => {
            if (code !== 0) {
                reject()

                return
            }

            resolve()
        })
    })
}