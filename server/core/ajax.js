const fs = require("fs");
var request = require('superagent');
exports.api = (paths, API_SET) => {  //api 文件夹，挂载api的对象
    
    let ajax = (config,path,param)=>{
        let url = config.basePath + config.config[path].uri;
        let methodType = config.config[path].method || 'get'
            return new Promise((ress) => {
                request[methodType](url)
                .query(param)
                .then(function (res) {
                    console.log(request)
                    ress(res.body);


                });
            }).then((data) => {
                return data
            })
        
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
                                    return ajax(config,path,param)

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
