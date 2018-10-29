const Koa = require("koa");
const fs = require("fs");
const router = require('koa-router')();
const views = require('koa-views');
const session = require('koa-session');

global.app = new Koa();
//模板处理
app.use(views(__dirname + '/src/views', {
    extension: 'ejs'
}))
app.keys = ['some secret hurr'];

const CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 10000,
    autoCommit: true, /** (boolean) automatically commit headers (default true) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};

app.use(session(CONFIG, app));


let API_SET = {};
global.API = {};




//ctx新增简化处理的方法
const { ctxMothed } = require('./core/ctx');

//导入逻辑处理
const { action, static } = require('./core/fileHandle');

//与后端ajax请求逻辑
const { api } = require('./core/ajax');

let srcPath = __dirname.split('/');
srcPath = srcPath.slice(0, srcPath.length - 2).join('/');
action(srcPath + '/src/Action', API_SET)   //读取开发者的api文件信息，即ajax请求的文件名称
action(__dirname + '/Action', API_SET)   //读取默认api文件信息，即ajax请求的文件名称
api(srcPath + '/src/Apis', API)   //读取api文件信息，与后端数据交互的逻辑
static('/public', srcPath + '/src/Static', app, router) //静态资源处理逻辑



//登陆模块 
const { login } = require('./Config/login')
app.use(async (ctx, next) => {
    ctxMothed(ctx);
    // login(ctx) && await next();
    await next();

})
// 对于任何请求，app将调用该异步函数处理请求：
app.use(async (ctx, next) => {


    //加载自定义的ctx方法

    let url = ctx.url.split('?')[0];//提取正式的url（解决api是get带参数）
   
    if (url == '/') {
        await API_SET['/index'](ctx)
        return;
    }

    API_SET[url] && await API_SET[url](ctx)


})




































// 在端口3000监听:
exports.index = () => app.listen(3200);
console.log('app started at port 3200...');