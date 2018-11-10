/**
 * Created by admin on 2018/9/1.
 */
exports.index = {

    needLogin: false,
    cors: false,//是否允许跨域访问  支持[域名1，域名形式]  注：功能还未增加
    requestHandler: async ctx => {
        // ctx 为 koa 的 context 上下文
        // 详见: http://koajs.com/#context



        /*
        *   以下示例中：
        *  mod名称前端可自定义，它的值与apis的config的key一致
        *  API.index中的index与apis文件名称一致
        */

        try {
            //API[apis_file_name](*uri名称=string，*参数={}，替换模版={})
            let data = await API.index(ctx.query.mod, ctx.query,{uri:'?a=b',param:'&c=d'})
            return ctx.ajax(data)
        } catch (e) {
            return ctx.ajax({ code: 0, data: { e }, msg: e })
        }
    }
}

