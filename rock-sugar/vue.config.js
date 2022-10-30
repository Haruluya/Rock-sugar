const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  removeAttributeQuotes:false,
  publicPath: "./",
  //devServer.
  devServer:{

  },

  // Alias.
  configureWebpack: {
    resolve: {
      alias: {
        'src':'@',
        '_assets': '@/assets',
        '_components': '@/components',
        '_pages':'@/pages',
        '_router':'@/router',
        '_store':'@/store',
        '_utils':'@/utils',
        '_mock':'@/mock',
        '_api':'@/api',
        '_plugins':'@/plugins',
        '_packages':'@/packages'
      }
    }
  }
})
