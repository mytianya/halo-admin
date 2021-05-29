module.exports = {
  publicPath: process.env.PUBLIC_PATH,

  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  devServer: {
    proxy: {
      "/api": {
        target: 'http://localhost:8090/', // 目标代理接口地址
        secure: false,
        changeOrigin: true,// 开启代理，在本地创建一个虚拟服务端
        ws: true
      }
    }
  },
  // babel-loader no-ignore node_modules/*
  lintOnSave: false,
  transpileDependencies: [],
  productionSourceMap: false
}
