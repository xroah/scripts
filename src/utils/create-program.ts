import {Command} from "commander"
import {NAME} from "./constants.js"

export default function createProgram() {
    return new Command().name(NAME)
}