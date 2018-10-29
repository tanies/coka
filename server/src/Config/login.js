const fs = require("fs");
var request = require('superagent');
exports.login = () => {

    return {  //api 文件夹，挂载api的对象
        ssoUrl: '',//空为自己的登陆系统
        login: '/login',   //登陆路径+参数
        logout: '/logout',  //注销路径+参数
        checkLogin: () => { }
    }
}
