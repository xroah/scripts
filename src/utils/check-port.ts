import net from "net"

const MAX_RETRIES = 10
const MAX_PORT = 65535

let count = 0

function startServer(
    port: number,
    host: string,
    callback: Function
) {
    const server = new net.Server()

    server.listen(port, host, () => {
        server.close(() => callback(null, port))
    })

    server.on("error", err => {
        server.close()
        callback(err)
    })
}

function check(port: number, host: string, callback: Function) {
    const handleError = (err: any, host: string, port: number) => {
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

    startServer(port, host, (err: any) => {
        if (err) {
            return handleError(err, host, port)
        }

        callback(null, port)
    })
}

export default function checkPort(
    port: number,
    host: string,
    callback: Function
) {
    count = 0

    //check the host
    check(port, host, (err: any, realPort: number) => {
        if (err) {
            return callback(err)
        }

        callback(null, realPort)
    })
}