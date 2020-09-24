const fs = require("fs")
const path = require("path")

const MAX_RETRIES = 10
const RETRY_INTERVAL = 150

function _clean(dir) {
    let stat = fs.lstatSync(dir)

    if (stat.isDirectory(dir)) {
        const files = fs.readdirSync(dir)

        while (files.length) {
            const file = files.pop()
            const filePath = path.resolve(dir, file)

            _clean(filePath)
        }

        fs.rmdirSync(dir)
    } else {
        fs.unlinkSync(dir)
    }
}

module.exports = function clean(dir) {
    let count = 0
    const cleanDir = () => {
        if (count >= MAX_RETRIES) {
            return
        }

        count++

        try {
            _clean(dir)
        } catch (error) {
            if (error.code !== "EBUSY") {
                throw error
            }

            setTimeout(cleanDir, RETRY_INTERVAL)
        }
    }

    cleanDir()
}