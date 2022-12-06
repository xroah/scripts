import { build } from "vite"
import { getPlugins } from "./vite-common.js"

interface Options {
    framework?: string
    jsx?: boolean
    config?: string
    extensions?: string[]
    base?: string
    target?: string
    outDir?: string
}

export default async function buildWithVite(
    {
        framework,
        jsx,
        config,
        extensions,
        base,
        target,
        outDir
    }: Options
) {
    const plugins = getPlugins(framework, jsx)

    await build({
        configFile: config ? config as string : false,
        resolve: {
            extensions: extensions as string[],
        },
        base: base as string,
        plugins,
        build: {
            target,
            outDir
        }
    })
}