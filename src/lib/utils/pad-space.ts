export = (str: string, spaceNum: number, prepend = false) => {
    const spaces = Array(spaceNum).fill(" ").join("")

    return prepend ? `${spaces}${str}` : `${spaces}${str}`
}