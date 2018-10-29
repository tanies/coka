const fs = require("fs");
var request = require('superagent');
exports.api = (paths, API_SET) => {  //api 文件夹，挂载api的对象

    let ajax = (config, path, param) => {
        console.log(config, path)
        let url = config.basePath + config.config[path].uri; //后台url
        let api = config.config[path]; //映射的路径
        let methodType = api.method || 'get'
        let _request = {
            url,
            param,
            method: methodType,
            header: Object.assign({
                'content-Type': 'application/x-www-form-urlencoded'
            }, api.header || {})
        }
        config.request && (_request = config.request(_request))
        return request[methodType](_request.url)
            .query(_request.param)
            .then(function (res) {
                
                //如果自定义响应数据
                if (config.response) {
                    return config.response(res)
                }

                //默认返回数据,当successCode匹配成功或者默认不设置都直接给前端
                if (res.body.status == config.successCode ||
                    config.successCode === undefined) {
                    return res.body;
                } else {
                    // 后端返回的数据异常时，新增与前端的标示code  。
                    return {
                        code: -1,
                        msg: JSON.stringify(res.body)
                    }
                }



            });


    }

    async function explorer(path, SET) {

        return new Promise((res) => {

            //读取apis文件
            fs.readdir(path, function (err, files) {
                if (err) {
                    console.error('error:\n' + err);
                    return;
                }

                files.forEach(function (file) {
                    fs.stat(path + '/' + file, function (err, stat) {
                        if (err) { console.error(err); return; }

                        //如果是文件夹，继续循环
                        if (stat.isDirectory()) {

                            explorer(path + '/' + file);
                        } else {
                            if (/.js$/.test(file)) {

                                //读取文件
                                let _file = require(path + '/' + file)

                                //处理对应的URl
                                file = (path + '/' + file).replace(/.js$/, '').replace(paths + '/', '')

                                API_SET[file] = (path, param = {}) => {

                                    //解析配置信息
                                    let config = Object.values(_file)[0]
                                    //
                                    return ajax(config, path, param)

                                }



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