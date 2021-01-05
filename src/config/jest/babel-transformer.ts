import babelJest from "babel-jest"
import getBabelConf from "../babel/babel.config"

export = babelJest.createTransformer({
    ...getBabelConf()
})