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
            new EnvironmentPlugin(['PROVIDER_URL', 'CONTRACT_ADDRESS', 'AUTH_REDIRECT_URI', 'AUTH_CLIENT_ID']),
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
