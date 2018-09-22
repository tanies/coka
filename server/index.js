const Koa = require("koa");
const fs = require("fs");
const router = require('koa-router')();

//import static from './Config/static'




const app = new Koa();
let API_SET = {};
let STATIC_SET = {};

//静态资源位置
//app.use(require('koa-static')(__dirname + '/src/Static'));

//  读取api文件
async function explorer(path,SET) {

    return new Promise((res) => {
        fs.readdir(path, function (err, files) {
            //err 为错误 , files 文件名列表包含文件夹与文件
            if (err) {
                console.error('error:\n' + err);
                return;
            }

            files.forEach(function (file) {
                fs.stat(path + '/' + file, function (err, stat) {
                    if (err) { console.error(err); return; }

                    if (stat.isDirectory()) {

                        explorer(path + '/' + file);
                    } else {
                        if (/.js$/.test(file)) {
                            let _file = require(path + '/' + file)
                            file = (path + '/' + file).replace(/.js$/,'').replace(paths,'')
                            API_SET[file] =Object.values(_file)[0]

                        }

                    }
                });

            });
            res()

        });
    })
}


let paths = (__dirname + '/src/Action');

explorer(paths,API_SET);


//静态资源处理
let staticPath = '/public'
let PathReg = new RegExp("^"+staticPath)
router.get( PathReg,async (ctx, next) => {

    let path = ctx.url.replace(PathReg,'')

async function readFile(){
    return  new Promise(function(reso,reje){

        fs.readFile(__dirname+'/src/Static'+path,function(err,data){
            if(err)
                reso('error-----');
            else
                reso(data);
        })
    }).then(function(data){
        return  data
    });
}
let data = await readFile();

ctx.response.type=
ctx.response.body = data;



})

app
    .use(router.routes())
    .use(router.allowedMethods());
console.log(router)


// 对于任何请求，app将调用该异步函数处理请求：
app.use(async (ctx, next) => {
    ctx.ajax = (data)=>{
    ctx.response.type = 'json';

    ctx.response.body =JSON.stringify(data);
}

    if (ctx.url == '/') {
        await API_SET['/index'](ctx)
        return;
    }

    API_SET[ctx.url]&&await API_SET[ctx.url](ctx)


})





async function handleApi(ctx) {

    return new Promise((res) => setTimeout(() => {
        ctx.response.body = 'json'
        ctx.response.type = 'json';
        res()
    },
        1000
    )
    )
}
async function handleStatic(ctx) {

    return new Promise((res) => setTimeout(() => {
        ctx.response.body = 'json'
        ctx.response.type = 'json';
        res()
    },
        1000
    )
    )
}































// 在端口3000监听:
app.listen(3200);
console.log('app started at port 3200...');