import path from "path"
import getProjectRoot from "./get-project-root.js"

export const cacheDir = path.join(getProjectRoot(), ".cache")

export const NAME = "reap-scripts"
export const commands = [{
    name: "rm",
    desc: "Remove directories or files"
}, {
    name: "start",
    desc: "Start a dev server"
}, {
    name: "build",
    desc: "Build the project"
}, {
    name: "lint",
    desc: "Run eslint"
}, {
    name: "tsc",
    desc: "Transpile ts[x] files"
}]