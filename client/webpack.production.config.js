
var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry:{
        app:path.resolve(__dirname,'./src/app.js'),
        vendors:['d3','react']
    },
    output:{
        path: path.resolve(__dirname,'./dist/'),
        filename: '[name].js'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({minimize:true}),
        new webpack.optimize.CommonsChunkPlugin('vendors','vendors.js'),
        new HtmlWebpackPlugin({
            title:"react-demo",
            filename:'app.html',
            template:'./build/app.html'      //Load a custom template 
        }),
        new webpack.DefinePlugin({
            "process.env":{
                NODE_ENV:JSON.stringify('production')
            }
        })
    ],
    externals:[{
        xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
    }],

    module: {
        //加载器配置
        loaders: [
            {test: /\.less/, loader: 'style-loader!css-loader!less-loader'},
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query:{
                    presets:['es2015','react']
                }
            },
            { test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
            { test: /\.(png|jpg|jpeg)$/, loader: 'url-loader?limit=8192'}
        ]
    },
    resolve: {
        extensions: ['', '.js', '.json', '.scss','.less','jsonp'],
        root: [
            path.resolve('./src')
        ]
    }
};