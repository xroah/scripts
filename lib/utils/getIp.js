const os = require("os")
const defaultGateway = require("default-gateway")

//get ip of IPv4 or IPv6
function getIp() {
    const ni = os.networkInterfaces()
    const gateway = defaultGateway.v4.sync()

    for (let item in ni) {
        const tmp = ni[item]

        for (let i = 0, l = tmp.length; i < l; i++) {
            const {
                address,
                internal
            } = tmp[i]

            if (!internal && item === gateway.interface) {
                return address
            }
        }
    }
}

module.exports = getIp