
var webpack = require('webpack');

var path = require('path');

module.exports = {

    entry: {
        indexs : './src/app.js'
    },

    output: {
        path: __dirname+'/builds/',
        filename: '[name].js'},
    //插件项
    plugins: [
    new webpack.NoErrorsPlugin()
  ],
    externals:[{
        xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
    }],

    module: {
        //加载器配置
        loaders: [
            //LESS文件先通过less-load处理成css，然后再通过css-loader加载成css模块，最后由style-loader加载器对其做最后的处理，
            // 从而运行时可以通过style标签将其应用到最终的浏览器环境
            {test: /\.less/, loader: 'style-loader!css-loader!less-loader'},
            //.css 文件使用 style-loader 和 css-loader 来处理
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            //.js 文件使用 jsx-loader 来编译处理 jsx-loader可以添加?harmony参数使其支持ES6语法
            { test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query:{
                    presets:['es2015','react']
                } //备注：es2015用于支持ES6语法，react用于解决render()报错的问题
            },
            //.scss 文件使用 style-loader、css-loader 和 sass-loader 来编译处理
            { test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
            //图片文件使用 url-loader 来处理，小于8kb的直接转为base64
            { test: /\.(png|jpg|jpeg)$/, loader: 'url-loader?limit=8192'}
        ]
    },
    //其它解决方案配置
    resolve: {

        extensions: ['', '.js', '.json', '.scss','.less','jsonp'],
        root: [
                path.resolve('./src')
            ]



    },
    devServer:{
        inline:true,
        port:3000,

        stats:'minimal',
        disableHostCheck: true
    }
};