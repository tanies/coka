const fs = require("fs");
var request = require('superagent');
exports.checkLogin = (ctx) => {  //api 文件夹，挂载api的对象
    let { login } = CONFIG

    let token = ctx.cookies.get(login.tokenName || 'loka_token');

    if (!token) {
        ctx.cookies.set(login.tokenName || loka_token, new Date())
        // ctx.ajax({ a: '111' })
    }
    return ctx.user = {}
    function checkLogin() {

    }
    return false
}


