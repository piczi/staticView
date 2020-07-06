const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const devMode = process.env.NODE_ENV !== 'production';
const viewDir = path.resolve(__dirname, '../page');
const pages = fs.readdirSync(viewDir, function(err, files) {
    if (err) {
        throw err;
    }
});

console.log(devMode ? '开发环境' : '生产环境');

const entryList = {};
const view = [];
const copyList = [];

//检测文件或者文件夹存在 nodeJS
function fsExistsSync(path) {
    try {
        fs.accessSync(path, fs.F_OK);
    } catch (e) {
        return false;
    }
    return true;
}

pages.forEach(value => {
    entryList[value + '/' + value] = viewDir + '/' + value + '/index.js';

    const html = new HtmlWebpackPlugin({
        template: viewDir + '/' + value + '/index.html',
        filename: value + '/index.html',
        chunks: [value + '/' + value],
    });
    view.push(html);

    const haveSource = fsExistsSync(path.resolve(__dirname, '../page/' + value + '/source/'));

    if (haveSource) {
        const target = {};
        target.from = 'page/' + value + '/source';
        target.to = value + '/source';
        copyList.push(target);
    }
});

module.exports = {
    entry: entryList,
    output: {
        path: path.resolve(__dirname, '../', 'dist'),
        filename: '[name].[hash].js',
        publicPath: '/',
    },
    module: {
        rules: [{
                test: /\.less$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: './',
                        },
                    },
                    'css-loader',
                    'less-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                // options: {
                //     presets: [
                //         [
                //             '@babel/preset-env',
                //             {
                //                 useBuiltIns: "usage",
                //             },
                //         ]
                //     ],
                // }
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: '[name].[ext]',
                        publicPath: './source/images/',
                        emitFile: false, // 禁止生成文件
                    },
                }, ],
            },
            {
                test: /\.(eot|svg|ttf|otf|woff|woff2|mp4|3gp)$/i,
                use: [{
                    loader: 'file-loader',
                    // 使用文件的相对路径，这里先不用这种方式
                    //     /// options: {
                    //     // 设置生成字体文件的路径名字信息 [path]相对context，outputPath输出的路径，publicPath相应引用的主路径
                    //     name: '[name][contenthash].[ext]',
                    //     publicPath: './source/media',
                    //     / useRelativePath: isProduction
                    // }
                }],
            }
        ]
    },
    plugins: [
        ...view,
        new MiniCssExtractPlugin({
            filename: '[name].[hash].css',
        }),
        new CopyPlugin({
            patterns: copyList,
        }),
    ],
};