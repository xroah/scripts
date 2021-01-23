import os from "os"
import defaultGateway from "default-gateway"

export default () => {
    const ni = os.networkInterfaces()
    const gateway = defaultGateway.v4.sync()

    for (let item in ni) {
        const tmp = ni[item]

        if (!tmp) {
            continue
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
                return address
            }
        }
    }
}