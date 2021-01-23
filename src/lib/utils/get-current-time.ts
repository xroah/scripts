
export default () => {
    const date = new Date()
    const map = new Map([
        ["Y", date.getFullYear()],
        ["M", date.getMonth() + 1],
        ["D", date.getDate()],
        ["h", date.getHours()],
        ["m", date.getMinutes()],
        ["s", date.getSeconds()]
    ])
    const convert = (num: number) => num > 10 ?
        num.toString() :
        (100 + num).toString().substring(1)

    return "Y-M-D h:m:s".split("").map(
        k => map.has(k) ? convert(map.get(k) as number) : k
    ).join("")
}