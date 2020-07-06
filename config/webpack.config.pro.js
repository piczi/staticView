const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base.js');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'); //压缩css插件


module.exports = merge(baseConfig, {
    mode: 'production',
    module: {
        rules: [

        ],
    },
    optimization: {
        minimizer: [new UglifyJsPlugin()],
    },
    plugins: [
        new CleanWebpackPlugin(),
        /**
         * css压缩
         */
        new OptimizeCssAssetsPlugin(),
    ]
});