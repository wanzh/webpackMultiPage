const path = require('path');
const merge = require('webpack-merge')
const baseConfig=require('./webpack.base');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
//cheap-module-eval-source-map
const prodConfig={
    mode: "production",
   /* devtool: "source-map",*/
   /* optimization: {
        minimizer: [
            /!*new TerserJSPlugin({}),*!/
            new OptimizeCSSAssetsPlugin({})
        ]
    },*/
    optimization: {
        minimizer: [
            /*new TerserJSPlugin({}),*/
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "css/[name].[contenthash].css"
        }),
        /*new ExtractTextPlugin({
            // 从js文件中提取出来的 .css文件的名称
            filename: `main.css`
        }),*/
    ],
    module: {
        rules: [
            {
                test: /\.scss/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    /*options: {
                        publicPath: '../'
                    }*/
                },"css-loader", 'postcss-loader', "sass-loader"]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                       /* options: {
                            publicPath: '../'
                        }*/
                    },
                    "css-loader"
                ]
            }
        ]
    },
    output: {
        /*publicPath: "http://resource.ttplus.cn/h5/ttplus-gw5.0",*/
        path: path.resolve(__dirname, '../dist'),
        filename: "js/[name].[contenthash].js",
        chunkFilename: "js/[name].chunk.[contenthash].js"
    }
};
module.exports =merge(baseConfig,prodConfig);