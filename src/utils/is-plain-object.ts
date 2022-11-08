export default function isPlainObject(obj: unknown) {
    return !!obj &&
        Object.prototype.toString.call(obj) === "[object Object]"
}