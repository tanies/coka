/**
 * Created by admin on 2018/9/1.
 */
exports.index = async (ctx) => {

    try {
        let data = await API.index(ctx.query.mod || 'index', ctx.query)
        console.log(data)
        ctx.ajax(data)
    } catch (e) {
        ctx.ajax({ code: 0, data: '', msg: e })
    }




}
