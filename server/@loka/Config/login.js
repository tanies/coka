const fs = require("fs");
var request = require('superagent');
exports.login = (ctx) => {  //api 文件夹，挂载api的对象
    // ctx.ajax({ ttt: 111 })
    // console.log(ctx.session)
    // if (/\login?/.test(ctx.url)) {
    //     return true
    // }
    // if (/\login?/.test(ctx.url) || ctx.session[ctx.cookies.get("UCID")]) {
    //     return true
    // } else {
    //     ctx.redirect('http://test3-passport.lianjia.com/cas/login?service=http://beta.mp.lianjia.com:3200/login?url=/')

    // }

    // ctx.redirect('http://test3-passport.lianjia.com/cas/login?service=http://beta.mp.lianjia.com:3200/login?gotoURL=%252F')
    return {}
}




