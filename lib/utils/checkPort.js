const MAX_RETRIES = 10
const MAX_PORT = 65535
const net = require("net")

let count = 0

function startServer(port, host, callback) {
    const server = new net.Server()

    server.listen(port, host, () => {
        server.close(() => callback(null, port))
    })

    server.on("error", err => {
        server.close()
        callback(err)
    })
}

function check(port, host, callback) {
    const handleError = function handleError(err, host, port) {
        if (err.code === "EADDRINUSE") {
            port++
            count++

            if (port > MAX_PORT || count >= MAX_RETRIES) {
                return callback(err)
            }

            return check(port, host, callback)
        }

        callback(err)
    }

    startServer(port, host, err => {
        if (err) {
            return handleError(err, host, port)
        }

        callback(null, port)
    })
}

module.exports = function checkPort(port, host, callback) {
    count = 0

    //check the host
    check(port, host, (err, realPort) => {
        if (err) {
            return callback(err)
        }

        callback(null, realPort)
    })
}