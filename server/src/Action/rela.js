/**
 * Created by admin on 2018/9/1.
 */
let data = require('../rela/tables')
exports.index = {

    needLogin: true,

    requestHandler: async ctx => {

        console.log(data.index())
        // render 回寻找view文件加下对应名称的ejs文件
        return ctx.render('index', { title: 'loka' });
    }
} 