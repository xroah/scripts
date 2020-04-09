const os = require("os");

//get ip of IPv4 or IPv6
function getIp(type) {
    const ni = os.networkInterfaces();

    for (let item in ni) {
        const tmp = ni[item];

        for (let i = 0, l = tmp.length; i < l; i++) {
            const {
                family,
                address
            } = tmp[i];

            if (family === type && address !== "127.0.0.1") {
                return address;
            }
        }
    }
}

exports.getIp = getIp;