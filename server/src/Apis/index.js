/**
 * Created by admin on 2018/9/1.
 */
var request = require('superagent');
exports.index ={
    basePath:'http://t.weather.sojson.com/',
    successCode:'',
    request:()=>{
        return 'ss'
    },
    response:()=>{

    },
    config:{
        'path':{
            uri:'api/weather/city/101030100',
            method:'get'
        }
    }
    // return new Promise((ress)=>{
    //     request.get('http://t.weather.sojson.com/api/weather/city/101030100').then(function (res) {
      
    //             ress(res.body);
            
        
    // });
    // }).then((data)=>{
    //     return data
    // })
    
   




}
