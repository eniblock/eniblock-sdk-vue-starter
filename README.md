# demo-sdk-vue

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### SDK integration for Vue 3
#### Requirements
To integrate the Eniblock SDK into your project, you will have to customize the [Webpack configuration](https://cli.vuejs.org/guide/browser-compatibility.html#usebuiltins-usage) to add some [polyfills](https://developer.mozilla.org/en-US/docs/Glossary/Polyfill).
Here are the requirements to use the Eniblock SDK:
- install the following dependencies:
   ```
   npm i --save-dev webpack@5.76.1
   npm i @eniblock/sdk buffer crypto-browserify stream-browserify node-polyfill-webpack-plugin
   ```
- update your vue.config.js file adding NodePolyfillPlugin in the plugins and resolve.fallback as well:
  ```
  const {defineConfig} = require('@vue/cli-service')
  const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
   
  module.exports = defineConfig({
    ...,
    transpileDependencies: true,
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
       ...
    }
  })
  ```
- check if babel.config.js file is present and contains:
  ```js
  module.exports = {
    presets: [
      '@vue/cli-plugin-babel/preset'
    ]
  }
  ```
##### For this demo
Finally, you will need to provide two environment variables in your .env(*) to be able to log in and get your access token:
```
AUTH_CLIENT_ID=<the client id of your auth provider>
AUTH_REDIRECT_URI=<the uri where your auth provider will redirect you after login>
```
