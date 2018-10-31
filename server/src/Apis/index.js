/**
 * Created by admin on 2018/9/1.
 */
// var request = require('superagent');
exports.index = {
    basePath: 'http://t.weather.sojson.com/',
    // successCode: 1, //与后台确定返回成功数据的状态吗,response 不设置时有效，不设置时皆按成功返回给前端
    request: (request) => {
        // console.log(request)
        return request
    },
    // response: (res) => {
    //     console.log(res)
    //     return res
    // },
    config: {
        'path': {
            uri: 'api/weather/city/101030100',
            method: 'get',

        },
        'index/path': {
            uri: 'api/weather/city/101030100',
            method: 'get',

        }
    }


}
