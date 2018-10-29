/**
 * Created by admin on 2018/9/1.
 */
exports.index = async (ctx) => {

    /*
    *   以下示例中：
    *  mod名称前端可自定义，它的值与apis的config的key一致
    *  API.index中的index与apis文件名称一致
    */
    // return ctx.render('index')



    // ctx.ajax({test:1111})
    console.log(ctx.query)
    // let data = await API.index(ctx.query.mod || 'index', ctx.query)
    ctx.ajax({ data: 111 })



}
