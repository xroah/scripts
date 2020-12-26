const fs = require("fs")
const path = require("path")

const MAX_RETRIES = 10
const RETRY_INTERVAL = 150

function remove(dir) {
    let stat = fs.lstatSync(dir)

    if (stat.isDirectory(dir)) {
        const files = fs.readdirSync(dir)

        while (files.length) {
            const file = files.pop()
            const filePath = path.resolve(dir, file)

            remove(filePath)
        }

        fs.rmdirSync(dir)
    } else {
        fs.unlinkSync(dir)
    }
}

module.exports = function removeDir(dir) {
    let count = 0
    const r = () => {
        if (count >= MAX_RETRIES) {
            return
        }

        count++

        try {
            remove(dir)
        } catch (error) {
            if (error.code !== "EBUSY") {
                throw error
            }

            setTimeout(r, RETRY_INTERVAL)
        }
    }

    r()
}