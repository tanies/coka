/**
 * Created by admin on 2018/9/1.
 */
var request = require('superagent');
exports.index = {

    needLogin: false,
    cors: false,//是否允许跨域访问  支持[域名1，域名形式]  注：功能还未增加
    requestHandler: async ctx => {

        //
        ctx.cookies.set(CONFIG.login.tokenName, '2.0069dd613afce9619e7874df886263a8cc')
        return ctx.redirect('/')

        return ctx.ajax({ code: 1, data: ctx.user })
        let { login } = CONFIG

        //

        if (ctx.query[login.backToken]) {
            ctx.cookies.set(login.tokenName, '2.0052efe3acc7dbe30843465d1edc2f6667')

            return ctx.ajax({ code: 1, data: ctx.user })
        } else {
            let url = login.ssoUrl + login.ssoLogin + '?' + login.backQueryName + '=' + 'http://beta.mp.lianjia.com:3200'

            return ctx.redirect(url)
        }

        // http://passport.lianjia.com/cas/login?service=http://beta.mp.lianjia.com:3300/login?gotoURL=%252F


        return ctx.ajax({ code: 1, data: ctx.user })
        // let config = {
        //     uri: 'http://i.session.lianjia.com/token/verify',
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        //     form:

        //         {
        //             token: '2.0052efe3acc7dbe30843465d1edc2f6667',
        //             source: 'cms',
        //             signature: '29b3541b90f06555508e97260cf80a21'
        //         }
        // }
        // request.post(config.uri)
        //     .send(config.form)
        //     .set('Content-Type', 'application/x-www-form-urlencoded')
        //     .end(function (err, res) {
        //         console.log(err, res)
        //         if (err) {
        //             //do something
        //         } else {
        //             //do something
        //         }
        //     })

        // return

    }
}

