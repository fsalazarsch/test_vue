const { defineConfig } = require('@vue/cli-service')
//module.exports = defineConfig({
//  transpileDependencies: true
//})

module.exports = {
  devServer: {
    proxy: {
      '/iklab': {
        target: 'https://ikcount.com',
        changeOrigin: true
      },
      '/ikcount': {
        target: 'https://ikcount.com',
        changeOrigin: true
      },
      '/socket.io': {
        target: 'wss://ikcount.com',
        changeOrigin: true
      }

    }
  }
}