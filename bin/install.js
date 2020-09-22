const childProc = require("child_process")

module.exports = function install(appDir, args, msg) {
    if (msg) {
        console.log()
        console.log(msg)
    }

    return new Promise((resolve, reject) => {

        const proc = childProc.spawn(
            "npm",
            args,
            {
                cwd: appDir,
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