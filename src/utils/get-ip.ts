import os from "os"
import defaultGateway from "default-gateway"

export default function getIp() {
    const ni = os.networkInterfaces()
    const gateway = defaultGateway.v4.sync()
    let ret
    let first

    for (let item in ni) {
        const tmp = ni[item]

        if (!tmp) {
            continue
        }

        if (!first) {
            first = tmp
        }

        for (let i = 0, l = tmp.length; i < l; i++) {
            const {
                address,
                internal,
                family
            } = tmp[i]

            if (
                !internal &&
                item === gateway.interface &&
                family.toLowerCase() === "ipv4"
            ) {
                ret = address
            }
        }
    }

    //use the first address
    if (!ret && first) {
        ret = first[0].address
    }

    return ret
}