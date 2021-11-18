import padSpace from "./pad-space.js"

export default function resizeString(str: string, length: number) {
    const len = str.length

    if (len > length) {
        return str.substr(0, len)
    }

    return padSpace(str, length - len)
}
