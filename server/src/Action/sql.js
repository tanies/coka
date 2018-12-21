
exports.index = {

    needLogin: true,
    cors: false,//是否允许跨域访问  支持[域名1，域名形式]  注：功能还未增加
    requestHandler: async ctx => {

        let query = 'SELECT * FROM tb_sssd_map '
        try {

            let data = await Modal.sqlQuery.sql(query);
            console.log(data)
            //todo
            ctx.ajax({ code: 1, data: data })
        } catch (e) {
            // ctx.ajax(e)
        }



    }
}

