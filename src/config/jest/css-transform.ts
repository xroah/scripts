// from: https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/jest/cssTransform.js

export default {
    process() {
        return "module.exports = {};"
    },
    getCacheKey() {
        // The output is always the same.
        return "cssTransform"
    }
}