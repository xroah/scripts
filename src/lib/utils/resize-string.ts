import padSpace from "./pad-space"

export = (str: string, length: number) => {
    const len = str.length

    if (len > length) {
        return str.substring(0, length + 1)
    }

    return padSpace(str, length - len)
}
