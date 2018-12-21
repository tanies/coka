// import csv from 'csv-box';
// import Node from './Node';

// const singles = [];
// const roots = [];
// const leaf = [];
// const normals = [];
// const nodes = {};

// console.time('t')

// const build = ()=>{
//     roots.forEach(ele =>{
//         let children = ele.children;

//         children.split(',').forEach(child=>{
//             nodes[child] = new Node(child, ele.table)
//         })
//     });

//     console.info(nodes)
// }

// csv('../examples/data/xueyuan.csv', results =>{
//     results.forEach(element => {
//         if(element.children){
//             element.children = element.children.replace(/,{2,}/g,',').replace(/(^,+)|(,+$)/g,'').trim();
//         }

//         if(!element.parent){
//             if(!element.children)
//                 singles.push(element);
//             else
//                 roots.push(element);
//         }else if(!element.children){
//             leaf.push(element)
//         }else{
//             if(!element.children)
//                 console.info(element)
//             normals.push(element);
//         }
//     });


//     build();


//     console.info(`all:${results.length}\nsingles:${singles.length}\nroots:${roots.length}\nleaf:${leaf.length}\nnormals:${normals.length}`)
//     console.info(singles.length+roots.length+leaf.length+normals.length)
    
//     console.timeEnd('t')
// })

