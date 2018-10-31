const fs = require("fs");
const request = require('superagent');
const { ctxMothed } = require('./ctx')
//ajax api问价处理逻辑

exports.action = async (paths, API_SET) => {  //(action)  文件夹，挂载api的对象

    return new Promise((complete) => {


        function explorer(path, SET) {

            return new Promise((res) => {
                fs.readdir(path, function (err, files) {
                    //err 为错误 , files 文件名列表包含文件夹与文件
                    if (err) {
                        console.error('error:\n' + err);
                        return;
                    }

                    files.forEach(function (file, idx) {
                        fs.stat(path + '/' + file, function (err, stat) {
                            if (err) { console.error(err); return; }

                            if (stat.isDirectory()) {

                                explorer(path + '/' + file);
                            } else {
                                if (/.js$/.test(file)) {
                                    let _file = require(path + '/' + file);//读取文件

                                    file = (path + '/' + file).replace(/.js$/, '').replace(paths, '')
                                    API_SET[file] = Object.values(_file)[0]
                                    if (idx === files.length - 1) {
                                        res()
                                        complete();
                                    }
                                }

                            }
                        });

                    });


                });
            })
        }
        explorer(paths, API_SET);
    })
}


//访问静态资源
exports.static = async (api, beforPath, app, router) => { //url开头字符串、静态资源位置、app、router
    return new Promise((complete) => {
        let PathReg = new RegExp("^" + api)

        router.get(PathReg, async (ctx, next) => {
            ctxMothed(ctx)
            let path = ctx.url.replace(PathReg, '')

            async function readFile() {
                return new Promise(function (reso, reje) {

                    fs.readFile(beforPath + path, function (err, data) {
                        if (err) {
                            reso(JSON.stringify({ code: -1, data: '', msg: err }));
                            next()
                        }
                        else {
                            reso({ code: 1, data });
                        }
                    })
                }).then(function (data) {
                    return data
                });
            }
            let data = await readFile();
            await ctx.renderStatic(data);



        })

        app
            .use(router.routes())
            .use(router.allowedMethods());

        complete()
    })
}


//合并配置项
exports.configHandle = async (CONFIG) => {
    return new Promise(async (complete) => {
        function explorer(path) {

            return new Promise((res) => {
                fs.readdir(path, function (err, files) {
                    //err 为错误 , files 文件名列表包含文件夹与文件
                    if (err) {
                        console.error('error:\n' + err);
                        return;
                    }

                    files.forEach(function (file, idx) {
                        fs.stat(path + '/' + file, function (err, stat) {

                            if (err) { console.error(err); return; }

                            if (/.js$/.test(file)) {
                                let _file = require(path + '/' + file);//读取文件

                                file = (path + '/' + file).replace(/.js$/, '').replace(path, '');
                                let configKey = file.slice(1)
                                CONFIG[configKey] = CONFIG[configKey] || {}
                                CONFIG[configKey] = Object.assign(CONFIG[configKey], Object.values(_file)[0]());

                                if (idx === files.length - 1) {
                                    res(CONFIG)
                                }

                            }

                        });

                    });



                });
            })
        }
        let srcPath = __dirname.split('/');
        let defaultConfigPath = srcPath.slice(0, srcPath.length - 1).join('/') + '/Config';
        await explorer(defaultConfigPath);

        let developerConfigPath = srcPath.slice(0, srcPath.length - 3).join('/') + '/src/Config'
        await explorer(developerConfigPath);

        complete();
    }
    )
}