/**
 * Created by admin on 2018/9/1.
 */
exports.index = {

    needLogin: true,

    requestHandler: async ctx => {

       
        // render 回寻找view文件加下对应名称的ejs文件
        return ctx.render('index', { title: 'loka' });
    }
} 