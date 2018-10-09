const Koa = require("koa");
const fs = require("fs");
const router = require('koa-router')();
const views = require('koa-views');

global.app = new Koa();
//模板处理
app.use(views(__dirname + '/src/views', {
    extension: 'ejs'
}))
let API_SET = {};
global.API = {};



//ctx新增简化处理的方法
const { ctxMothed } = require('./core/ctx');

//导入逻辑处理
const { action, static } = require('./core/fileHandle');

//与后端ajax请求逻辑
const { api } = require('./core/ajax');
action(__dirname + '/src/Action', API_SET)   //读取api文件信息，即ajax请求的文件名称
api(__dirname + '/src/Apis', API)   //读取api文件信息，与后端数据交互的逻辑
static('/public', __dirname + '/src/Static', app, router) //静态资源处理逻辑



// 对于任何请求，app将调用该异步函数处理请求：
app.use(async (ctx, next) => {
    ctxMothed(ctx);  //加载自定义的ctx方法

    let url = ctx.url.split('?')[0];//提取正式的url（一版解决api是get带参数）
    if (url == '/') {
        await API_SET['/index'](ctx)
        return;
    }

    API_SET[url] && await API_SET[url](ctx)


})




































// 在端口3000监听:
app.listen(3200);
console.log('app started at port 3200...');