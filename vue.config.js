const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
// 检查循环引用
const CircularDependencyPlugin = require('circular-dependency-plugin');

const isLib = process.env.TYPE === 'lib';

module.exports = {
  configureWebpack(config) {
    console.log(config.plugins);
  },
  chainWebpack(config) {
    if (!isLib) config.plugin('monaco').use(new MonacoWebpackPlugin());
    config.plugin('circular').use(new CircularDependencyPlugin());
  },
};
