export default function setEnv(env: string) {
    process.env.NODE_ENV = env
    process.env.BABEL_ENV = env
}