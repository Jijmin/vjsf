const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
// 检查循环引用
const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = {
  configureWebpack(config) {
    console.log(config.plugins);
  },
  chainWebpack(config) {
    config.plugin('monaco').use(new MonacoWebpackPlugin());
    config.plugin('circular').use(new CircularDependencyPlugin());
  },
};
