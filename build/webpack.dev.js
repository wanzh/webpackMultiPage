const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const os = require('os');
//const apiMocker = require('mocker-api');
/*const Mock = require('../mock/mock.js');*/
///////////////////获取本机ip///////////////////////
function getIPAdress() {
    let interfaces = os.networkInterfaces();
    for (let devName in interfaces) {
        let iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            let alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}

//cheap-module-eval-source-map
const devConfig = {
    mode: "development",
    devtool: "cheap-module-source-map",
    devServer: {
        contentBase: './dist',
        open: true,
        overlay: true,
        hot: true,
        host: getIPAdress(),
        port: 3000,
        before(app){
            //apiMocker(app, path.resolve("./mock/index.js"));
        },
        proxy: {
            /*'/login/':{
                changeOrigin: true,
                target: 'http://wwwdev.ttplus.cn/',
            },*/
            '/24h': {
                changeOrigin: true,
                target: 'http://www.ttplus.cn/',
            },
            '/carousellData': {
                target: 'http://www.ttplus.cn/',
                changeOrigin: true
            }
        }
        /* hotOnly: true*/
    },
    module: {
        rules: [
            {
                test: /\.css/,
                use: ['style-loader', 'css-loader', 'postcss-loader']
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    "css-loader",
                    'postcss-loader',
                    "sass-loader",
                ]
            },
            /* {
                 test: /\.scss/,
                 use: ["style-loader", {
                     loader: "css-loader",
                     options: {
                         importLoaders: 2,
                         modules: true
                     }
                 }, "sass-loader", 'postcss-loader']
             }*/
        ]
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: "js/[name].[hash].js",
        chunkFilename: "js/[name].chunk.js"
    }
};
module.exports = merge(baseConfig, devConfig);