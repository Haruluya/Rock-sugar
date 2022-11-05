const { defineConfig } = require('@vue/cli-service')
var path = require('path')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,


  publicPath: process.env.NODE_ENV === "production" ? "/Rock-sugar" : "/",
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [
        path.resolve(__dirname, "./src/styles/global.less"),
      ],
    },
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
        '_packages':'@/packages',
        '_styles':'@/styles'
      }
    }
  }
})