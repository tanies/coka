const fs = require("fs");
exports.ctxMothed = (ctx)=>{
    ctx.ajax = (data) => {
        ctx.response.type = 'json';
        ctx.response.body = JSON.stringify(data);
    }
}