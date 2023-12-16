module.exports={
  productionSourceMap:false,
  lintOnSave:false,// 关闭每次代码保存时eslint的语法检查
  devServer: {
    proxy: {
      '/api': {
        target: 'http://gmall-h5-api.atguigu.cn',
        // pathRewrite:{'^/api':''} // 因为实际转发到最终的服务器上的url带有'/api'，所以不需要将标识前缀移除
      }
    }
  }
}
