import commander from "commander"

export default function createStartCommand(program: commander.Command) {
    const start = program.command("start")

    start.option("-p, --port [value]", "Specify a port")
    .option("-o, --open", "Open browser")
    .action(function(cmd, options) {
        console.log(options)
    })
    
    return start
}