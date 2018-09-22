/**
 * Created by admin on 2018/9/1.
 */
exports.index = (ctx) => {
    return new Promise((res) => {
        setTimeout(() => {
            ctx.response.type = 'json';

            ctx.response.body = 'testjson';
            res()
        }
            , 5000)
    })



}
