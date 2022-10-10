import path from "path"
import getProjectRoot from "./get-project-root.js"

export const cacheDir = path.join(getProjectRoot(), ".cache")

export const NAME = "r-scripts"