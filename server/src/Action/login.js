/**
 * Created by admin on 2018/9/1.
 */
exports.index = async (ctx) => {

    // console.log(ctx.session, "___")

    ctx.session[ctx.cookies.get('UCID')] = new Date();
    ctx.redirect('/')
    // ctx.ajax({ test: 1111 })




}
