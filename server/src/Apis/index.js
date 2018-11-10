
exports.production = {
    basePath: 'http://t.weather.sojson.com/',
    // successCode: 1, //与后台确定返回成功数据的状态吗,response 不设置时有效，不设置时皆按成功返回给前端
    request: (request) => {
        // console.log(request)
        // console.log(request)
        return request
    },
    // response: (res) => {
       
    //     return res
    // },
    config: {
        'path': {
            uri: 'api/weather/city/101030100',
            method: 'get',

        },
        //模版替换示列 
        // 'path': { //uri 名称
        //     uri: 'api/weather/city/{uri}',
        //     method: 'get',

        // },
        'index/path': {
            uri: 'api/weather/city/101030100',
            method: 'get',

        }
    }


}


// 默认是用以上信息，在开发模式或者测试模式一下信息和合并到proction里
// exports.dev = {
//     basePath: 'http://t.weather.sojson.com/',
// };
exports.test = {
    
}
