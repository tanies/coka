/*
* 实现说明：
* 各个sso验证有所差异，sso验证规则自己完成，但一下要求是统一的：
*           1.若验证成功需要把自己需要信息赋值给ctx.user或者设置ctx.user = true
*           2.若验证失败，重定向到对应的sso验证
*/


const fs = require("fs");
const request = require('superagent');
const login = {  //api 文件夹，挂载api的对象
    session: 'http://test3-i.session.lianjia.com',
    uc_out: '//test3-passport.lianjia.com',
    uc: 'http://test3-passport.lianjia.com',
    tokenName: 'coka_token',
    ssoUrl: 'http://test3-passport.lianjia.com',//单点登陆地址，空为自己的登陆系统
    ssoLogin: '/cas/login',   //登陆路径+参数
    ssoLogout: '/logout',  //注销路径+参数
    backQueryName: 'service',
    backToken: 'token',

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

exports.index = () => {
    return {
        redirectLogin: async (ctx) => {
            // let ssoLogin='';
            let ssoLogin = '/login?' + 'service=http://beta.mp.lianjia.com:3400/login?goto=/&ticket=abcd'
            ctx.redirect(ssoLogin)

        },
        check: async function (ctx, loginToken) {
            let { cookies } = ctx;
            let token = loginToken || ctx.cookies.get(login.tokenName);
            console.log(token)
            let config = {
                uri: login.sessionUrl || login.ssoUrl,
                method: login.sessionMethod,
                headers: login.sessionHeaders,
                form: Object.assign(login.sessionSign, { token })

            }

            let checkLogin = () => {


                return new Promise((comlete) => {
                    return setTimeout(() => {
                        ctx.user = {};
                        // !token && cookies.set(login.tokenName, '')
                        !token && this.redirectLogin(ctx)
                        comlete();
                    },1);


                    request.post(config.uri)
                        .send(config.form)
                        .set(config.headers)
                        .end(function (err, res) {

                            if (err) {
                                console.log(err, '--')
                                //do something
                            } else {
                                let loginStatus = res.data;
                                if (loginStatus.state === 200) {

                                    ctx.user = loginStatus.data
                                } else {
                                    this.redirectLogin(ctx)
                                }


                            }
                            comlete();
                        })
                }
                )
            }



            return checkLogin()

        }
    }

}

