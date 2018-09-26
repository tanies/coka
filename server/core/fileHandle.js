const fs = require("fs");
var request = require('superagent');
//ajax api问价处理逻辑
exports.action = (paths, API_SET) => {  //(action)  文件夹，挂载api的对象

    async function explorer(path, SET) {

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
                                file = (path + '/' + file).replace(/.js$/, '').replace(paths, '')
                                API_SET[file] = Object.values(_file)[0]

                            }

                        }
                    });

                });
                res()

            });
        })
    }
    explorer(paths, API_SET);
}


//访问静态资源
exports.static = (api, beforPath, app, router) => { //url开头字符串、静态资源位置、app、router
    let PathReg = new RegExp("^" + api)

    router.get(PathReg, async (ctx, next) => {

        let path = ctx.url.replace(PathReg, '')

        async function readFile() {
            return new Promise(function (reso, reje) {

                fs.readFile(beforPath + path, function (err, data) {
                    if (err){
                        reso(JSON.stringify(err));
                        next()
                    }
                    else{
                        reso(data);
                    }
                })
            }).then(function (data) {
                return data
            });
        }
        let data = await readFile();

        ctx.response.type =
            ctx.response.body = data;



    })

    app
        .use(router.routes())
        .use(router.allowedMethods());
}