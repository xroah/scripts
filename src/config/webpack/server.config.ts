import {Configuration} from "webpack-dev-server"

const serverConfig: Configuration = {
    port: 3000,
    inline: true,
    hot: true,
    historyApiFallback: true,
    compress: true
}

export default serverConfig