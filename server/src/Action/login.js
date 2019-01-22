/**
 * Created by admin on 2018/9/1.
 */
var request = require('superagent');
exports.index = {

    needLogin: false,
    cors: false,//是否允许跨域访问  支持[域名1，域名形式]  注：功能还未增加
    requestHandler: async ctx => {

        let { login } = Config
        let { query, cookies } = ctx
        //let token = ctx.cookies.get(login.tokenName); //基于sso设置的cookie
        let token = ctx.query[login.ticketKey];    //基于sso的令牌
        cookies.set(login.tokenName, token)
        let redirectUrl = login.ssoUrl + login.ssoLogin + '?' + login.backQueryName + '=' + 'http://beta.mp.com:3200';
        if (token) {

            //再一次检测token是否合法
            await Modal.checkLogin.check(ctx, token)
            if (ctx.user) {
                redirectUrl = query.goto || '/'; //返回到原来的访问地址

            }
        }
        return ctx.redirect(redirectUrl)


    }
}

