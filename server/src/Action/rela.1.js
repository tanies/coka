/**
 * Created by admin on 2018/9/1.
 */
// let renderImg = require('../rela/tables')
// let data = require('../rela/data/table_array');
// const phantom = require('phantom');
// // const $ = require('zepto')

// let instance, page;
// let initPhantom = async function () {
//     instance = await phantom.create();

//     page = await instance.createPage();
//     // await page.on('onResourceRequested', function (requestData) {
//     //     console.info('Requesting', requestData.url);
//     // });
//     page.property('viewportSize', { width: 1800, height: 1200 });
// }
// // initPhantom();

// let create = async () => {
//     let list = {}
//     let results = data.map(element => {
//         let newElement = {}
//         for (let key in element) {
//             let newKey = key.replace(/\"/g, '')
//             newElement[newKey] = element[key]
//         }
//         newElement.parents = newElement.parents || []
//         newElement.children = newElement.children || []
//         list[newElement.name] = newElement
//         return newElement
//     });


//     return { list, results };
// }
// let  createList = create()
exports.index = {

    needLogin: true,

    requestHandler: async ctx => {

        // console.time('open')
        // const status = await page.open('http://beta.mp.lianjia.com:3200/rela/index.html', function (s, e) {

        //     console.log(s, e)
        //     var content = page.content;
        //     console.log('Content: ' + content);
        // }, function (e) { console.log(e) });
        // const content = await page.property('content');
        // console.log(page)
        // // ctx.ajax({ code: 1, data: JSON.stringify(page) })

        // console.log(content);
        // console.log(status)
        // // await page.render(`name--${Date.now()}.png`);
        // console.timeEnd('open')
        // return
        // console.log(status,page)
        // renderImg.index(createList)
        // // render 回寻找view文件加下对应名称的ejs文件
        // return ctx.render('index', { title: 'loka' });
    }
} 