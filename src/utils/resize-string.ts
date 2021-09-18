import padSpace from "./pad-space"

export default (str: string, length: number) => {
    const len = str.length

    if (len > length) {
        return str.substr(0, len)
    }

    return padSpace(str, length - len)
}
