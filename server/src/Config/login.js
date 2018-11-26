const fs = require("fs");
var request = require('superagent');
exports.index = () => {
    //一般sso登录与登出的url为get方式，可以根据实际情况拼接参数
    return {  //api 文件夹，挂载api的对象
        session: 'http://test3-i.session.lianjia.com',
    uc_out: '//test3-passport.lianjia.com',
    uc: 'http://test3-passport.lianjia.com',
        tokenName: 'coka_token',
        ssoUrl: 'http://test3-passport.lianjia.com',//单点登陆地址，空为自己的登陆系统
        ssoLogin: '/cas/login',   //登陆路径+参数
        ssoLogout: '/logout',  //注销路径+参数
        backQueryName: 'service',
        backToken:'token',

        sessionUrl: 'http://test3-i.session.lianjia.com', //有sso的session验证地址是独立的，为空时，默认为ssoUrl
        sessionMethod: 'post',
        sessionHeaders: { 'Content-Type': 'application/x-www-form-urlencoded' },
        sessionSign: {

            source: 'cms',
            signature: '29b3541b90f06555508e97260cf80a21'
        },
        /*
        * 自定义验证登陆成功的规则，
        * 必须有返回值，如果返回值为false，则会重新登陆，
        * 其他返回值会赋值给ctx.user
        */
        checkLogin: (data) => { return { data, token: data.token } }
    }
}
