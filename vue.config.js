const {defineConfig} = require('@vue/cli-service')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        host: 'a.myho.st',
        port: 8888,
        server: 'https',
    },
    configureWebpack: {
        plugins: [new NodePolyfillPlugin()],
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
