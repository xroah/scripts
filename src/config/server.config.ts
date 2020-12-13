import {Configuration} from "webpack-dev-server"

const serverConfig: Configuration =  {
    port: 3000,
    inline: true,
    historyApiFallback: true,
    open: true,
    compress: true,
}

export default serverConfig