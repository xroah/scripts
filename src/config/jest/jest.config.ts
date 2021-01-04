import path from "path"

module.exports = {
    clearMocks: true,
    coverageDirectory: path.join(process.cwd(), "coverage"),
    coverageProvider: "babel",
    testMatch: [
        '<rootDir>/tests/**/*.spec.[jt]s?(x)'
    ],
    testEnvironment: "jsdom",
    transform: {
        "\\.[jt]sx?$": path.resolve(__dirname, "./babel-transformer.js")
    },
    transformIgnorePatterns: ["node_modules"]
}