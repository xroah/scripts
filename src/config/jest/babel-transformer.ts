import babelJest from "babel-jest"
import babelConf from "../babel/babel.config"

export default babelJest.createTransformer({
    ...babelConf
})