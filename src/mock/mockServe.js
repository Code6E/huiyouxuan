// 引入mockjs模块
import Mock from 'mockjs'
// Webpack默认对外暴露的数据是图片和json文件（这就意味着这类文件不用写对外暴露的语句）
import banner from './banner.json'
import floor from './floor.json'

// Mock.mock(请求地址, 请求数据)
Mock.mock('/mock/banner', {code:200,data:banner})
Mock.mock('/mock/floor', {code:200,data:floor})
// 因为只是需要将该文件引入到入口文件执行一次，而不用使用该文件对外暴露的对象，所以就不需要对外暴露
