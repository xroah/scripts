export default function isPlainObject(obj: any) {
    return !!obj && Object.prototype.toString.call(obj) === "[object Object]"
}