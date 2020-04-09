const checkPort = require("./checkPort");

checkPort(8868, (err, port) => {
    if (err) {
        return console.log(err)
    }

    console.log(`port=======>${port}`)
})