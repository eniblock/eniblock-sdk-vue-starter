const {defineConfig} = require('@vue/cli-service')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const dotenv = require('dotenv');
const {EnvironmentPlugin} = require('webpack')

dotenv.config();

module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        host: 'localtest.me',
        port: 8888,
        https: true
    },
    configureWebpack: {
        plugins: [
            new EnvironmentPlugin(['ENIBLOCK_AUTH_REDIRECT_URI', 'ENIBLOCK_AUTH_CLIENT_ID', 'ENIBLOCK_AUTH_SDK_URL']),
            new NodePolyfillPlugin()],
        resolve: {
            extensions: ['.ts', '.js'],
            modules: ['src', 'node_modules'],
            fallback: {
                crypto: require.resolve('crypto-browserify'),
                stream: require.resolve('stream-browserify'),
                buffer: require.resolve('buffer'),
            }
        },
        optimization: {
            splitChunks: {
                chunks: "all"
            }
        }
    }
})
