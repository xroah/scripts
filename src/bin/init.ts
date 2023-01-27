import yargs from "yargs";

// init react app
export default function createInitCommand(y: typeof yargs) {
    y.command(
        "init <name>",
        "Create react app",
        {},
        argv => {
            console.log(argv)
        }
    )
}