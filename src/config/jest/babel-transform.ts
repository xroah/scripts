import babelJest from "babel-jest"
import getBabelConf from "../babel/babel.config.js"

export default babelJest.createTransformer!({
    ...getBabelConf()
})