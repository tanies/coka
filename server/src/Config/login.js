const fs = require("fs");
var request = require('superagent');
exports.login = () => {
    //一般sso登录与登出的url为get方式，可以根据实际情况拼接参数
    return {  //api 文件夹，挂载api的对象
        ssoUrl: '',//空为自己的登陆系统
        login: '/login',   //登陆路径+参数
        logout: '/logout',  //注销路径+参数
        checkLogin: () => { }  //验证登陆成功的规则，必须有返回值，如果返回值为false，则会重新登陆，否则返回值会赋值给ctx.user
    }
}
