const HtmlWebpackPlugin = require('html-webpack-plugin');
/*const CleanWebpackPlugin = require('clean-webpack-plugin');*/
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const TransferWebpackPlugin = require('transfer-webpack-plugin');
/*production devtool: cheap-module-eval-source-map
development devtool: cheap-module-source-map*/
const makePlugins = (configs) => {
    const plugins = [
        new CleanWebpackPlugin(),
        new TransferWebpackPlugin([
            {
                from: 'assets',
                to: 'assets'
            }
        ], path.resolve(__dirname,"../src")),
        /*new webpack.optimize.CommonsChunkPlugin({
            name : 'common',
            filename : 'js/common.js'
        })*/
        //Shimming自动加载模块，而不必到处import或require它们。
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            jquery: "jquery",
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
            videojs: 'video.js',
        })
    ];
    Object.keys(configs.entry).forEach(name => {
        if(name!='app'){
            let stats=fs.statSync(configs.entry[name]);
            let chunks=['runtime','vendors','app'];
            if(stats.size>0){
                chunks.push(name);
            }
            chunks.push(name);
            plugins.push(new HtmlWebpackPlugin({
                template: `src/pages/${name}/${name}.html`,
                filename: `${name}.html`,
                chunks: chunks,
              /*  inject: 'head',*/
                minify: {
                    removeComments: true, // 移除 HTML 中的注释
                    collapseWhitespace: false, // 删除空白符与换行符
                    minifyCSS: true ,// 压缩内联 css
                    removeAttributeQuotes: true
                },
            }))
        }

    });
    const files = fs.readdirSync(path.resolve(__dirname, '../dll'));
    files.forEach(file => {
        if (/.*\.dll.js/.test(file)) {
            plugins.push((new AddAssetHtmlWebpackPlugin({
                filepath: path.resolve(__dirname, '../dll', file),
                outputPath: 'js',
                publicPath: 'js'
            })))
        }
        if (/.*\.manifest.json/.test(file)) {
            plugins.push(new webpack.DllReferencePlugin({
                manifest: path.resolve(__dirname, '../dll', file)
            }));
        }
    });
    return plugins;
};

function getEntry() {
    let entry = {};
    entry.app='./src/app.js';
    glob.sync('./src/pages/**/*.js').forEach(function (name) {
        let start = name.indexOf('src/') + 4;
        let end = name.length - 3;
        let n = name.slice(start, end);
        n = n.split('/')[1];
        entry[n] = name;
    });
    return entry;
}

const configs = {
    entry: getEntry(),
     resolve: {
         extensions: ['.js'],//import默认引入的文件
         alias: {
             /*jquery:path.resolve(__dirname,'../src/assets/jquery-vendor.js'),*/
            /* jquery:path.resolve(__dirname,'../src/js/jquery-1.8.2.min.js'),*/
         }
     },
    module: {
        rules: [
            {
                test: /\.js$/, exclude: /node_modules/, use: [{
                    loader: "babel-loader"
                }]
            },
            {
                test: /\.(jpg|png|gif)$/,
                use: {
                    loader: "url-loader",
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'images/',
                        limit: 1024
                    }
                }
            },
            {
                test: /\.(eot|svg|woff|woff2)$/,
                use: "file-loader"
            }
        ]
    },
    optimization: {
        usedExports: true,//开发环境development Tree Shaking
       /* runtimeChunk: {
            name: 'runtime'
        },*/
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    name: "vendors"
                }
            }
        }
        /*splitChunks: {
            chunks: 'async',//all
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    filename: "vendors"
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }*/
    },
    /*optimization: {
        usedExports: true,//开发环境development Tree Shaking
        runtimeChunk: {
            name: 'runtime'
        },
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    name: "vendors"
                }
            }
        },
    }//代码分割*/
};
configs.plugins = makePlugins(configs);
module.exports = configs;