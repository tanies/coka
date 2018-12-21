// import csv from 'csv-box';
// import demoData from './data/demoData';

// let list, counts, openNodes;

// let scene, camera, controls, renderer;

// let loader = new THREE.FontLoader();

// // 获取id的相关nodes和edges
// let getAncestorNodes = (list, id, direction) => {
//     direction = direction || 'up';

//     if(!list[id]){
//         console.info(`no ${id}`)
//         return;
//     }

//     let data = { nodes: [Object.assign({nodeType:'main'},list[id])], edges: [] };
//     let leafPath = {};
//     let nodesIndex = [id];
//     let edgeIndexs = [];

//     let addParentRelationships = (key) => {
       
//         let current = list[key];
//         if(!current){
//             return;
//         }
//         let nexts = direction === 'down'? current.children: current.parents;
//         nexts.forEach(nextKey => {
            
//             let source = nextKey;
//             let target =  key;
//             if(source === target){
//                 return;
//             }

//             if(direction === 'down'){
//                 source = key;
//                 target = nextKey;
//             }

//             let edgeIndex = `${source}-${target}`;

//             if(!edgeIndexs.includes(edgeIndex) && source in list && target in list){
//                 data.edges.push({source: source, target: target});
//                 edgeIndexs.push(edgeIndex);
//             }

//             if(!nodesIndex.includes(nextKey)){
//                 if(!list[nextKey]){
//                     return;
//                 }
//                 data.nodes.push(Object.assign({nodeType:direction},list[nextKey]));
//                 nodesIndex.push(nextKey);
//                 addParentRelationships(nextKey);
//             }
//         });
//     }

//     let getLeafPath = (key, currentPath) => {
       
//         let current = list[key];
//         if(!current){
//             return;
//         }
//         let nexts = direction === 'down'? current.children: current.parents;
//         if(nexts.length>0){
//             nexts.forEach(nextKey => {
//                 let childCurrentPath = currentPath+"|"+nextKey
//                 if(!currentPath.split('|').includes(nextKey)){
//                     getLeafPath(nextKey, childCurrentPath);
//                 }else{
//                     if(leafPath[nextKey]){
//                         leafPath[nextKey].push(childCurrentPath)
//                     }else{
//                         leafPath[nextKey] = [childCurrentPath]
//                     }
//                 }
                
//             });
//         }else{
//             if(leafPath[key]){
//                 leafPath[key].push(currentPath)
//             }else{
//                 leafPath[key] = [currentPath]
//             }
//         }
//     }

//     let rootPath = id

//     addParentRelationships(id);
//     getLeafPath(id, rootPath);
    
//     nodesIndex = undefined;
 
//     return {data, leafPath};
// }

// // 获取CSV中的节点数据
// let createList = async() => {

//     let getCSVData = async ()=>{
//         return await new Promise((resolve, reject) => {
//             csv('./data/table_array.csv', results =>{
//                 resolve(results);
//             });
//         });
//     }

//     let list = {};
//     let results = await getCSVData();

//     results = results.map(element => {
//         let newElement = {}
//         for(let key in element){
//             let newKey = key.replace(/\"/g,'')
//             newElement[newKey] = element[key]
//         }
//         newElement.parents = newElement.parents?newElement.parents.split(","):[]
//         newElement.children = newElement.children?newElement.children.split(","):[]
//         list[newElement.name] = newElement
//         return newElement
//     });


//     return {list, results};
// }

// // 绘制以id为中心的节点血缘图
// let renderGraph = (id, showOrHideleafId) => {

//     // let ups = getAncestorNodes(list, id, 'up');
//     // let downs = getAncestorNodes(list, id, 'down');
//     // let nodes = {};
//     // let edges = {};

//     // if(!showOrHideleafId){
//     //     let isOverCount = ( parseInt(list[id].ups) + parseInt(list[id].downs) > 100 );
//     //     openNodes = isOverCount?[]:[].concat( Object.keys(ups.leafPath), Object.keys(downs.leafPath) )
//     // }else{
//     //     let index = openNodes.indexOf(showOrHideleafId)
//     //     if(index<0){
//     //         openNodes.push(showOrHideleafId)
//     //     }else{
//     //         openNodes.splice(index, 1)
//     //     }
//     // }


//     // for(let key in ups.leafPath){

//     //     nodes[key] = Object.assign({nodeType:'up'},list[key])

//     //     let count = ups.leafPath[key].reduce((acc,path)=>acc+path.split("|").length-2, 0)

//     //     if(count){

//     //         if(openNodes.indexOf(key)<0){
//     //             nodes[`${key}|${id}`] = {
//     //                 nodeType:"open",
//     //                 id:`${key}|${id}`,
//     //                 shape:"circle",
//     //                 count,
//     //                 target:key
//     //             }
//     //         }
            
//     //         if(openNodes.indexOf(key)<0 && id!==key){
//     //             edges[`${key}-${key}|${id}`] = {source: key,target: `${key}|${id}`}
//     //             edges[`${key}|${id}-${id}`] = {source: `${key}|${id}`,target: id}
//     //         }
//     //     }else if(id!==key){
//     //         edges[`${key}-${id}`] = {source: key,target: id}
//     //     }
//     // }

//     // for(let key in downs.leafPath){

//     //     nodes[key] = Object.assign({nodeType:'down'},list[key])

//     //     let count = downs.leafPath[key].reduce((acc,path)=>acc+path.split("|").length-2, 0)

//     //     if(count){
//     //         if(openNodes.indexOf(key)<0){
//     //             nodes[`${id}|${key}`] = {
//     //                 nodeType:"open",
//     //                 id:`${id}|${key}`,
//     //                 shape:"circle",
//     //                 count,
//     //                 target:key
//     //             }
//     //         }
    
//     //         if(openNodes.indexOf(key)<0 && id!==key){
//     //             edges[`${id}-${id}|${key}`] = {source: id,target: `${id}|${key}`}
//     //             edges[`${id}|${key}-${key}`] = {source: `${id}|${key}`,target: key}
//     //         }
//     //     }else if(id!==key){
//     //         edges[`${id}-${key}`] = {source: id,target: key}
//     //     }

//     // }
    

//     // for (let n = 0; n < openNodes.length; n++) {

//     //     const leafId = openNodes[n];

//     //     if(ups.leafPath[leafId]){
//     //         let paths = ups.leafPath[leafId];
//     //         for(let i=0;i<paths.length;i++){
//     //             let path = paths[i].split("|")
//     //             for(let j=0;j<path.length;j++){
                    
//     //                 nodes[path[j]] = Object.assign({nodeType:'up'},list[path[j]])
    
//     //                 if( j<path.length-1 && path[j+1]!==path[j] ){
//     //                     edges[`${path[j+1]}-${path[j]}`] = {
//     //                         source: path[j+1],
//     //                         target: path[j]
//     //                     }
//     //                 }
                    
//     //             }
//     //         }
//     //     }
//     //     if(downs.leafPath[leafId]){
//     //         let paths = downs.leafPath[leafId];
//     //         for(let i=0;i<paths.length;i++){
//     //             let path = paths[i].split("|")
//     //             for(let j=0;j<path.length;j++){
    
//     //                 nodes[path[j]] = Object.assign({nodeType:'down'},list[path[j]])
    
//     //                 if( j<path.length-1 && path[j+1]!==path[j] ){
//     //                     edges[`${path[j]}-${path[j+1]}`] = {
//     //                         source: path[j],
//     //                         target: path[j+1]
//     //                     }
//     //                 }
                    
//     //             }
//     //         }
//     //     }
        
//     // }
    

//     // nodes[id] = Object.assign({nodeType:'main'},list[id])

//     // let data = {nodes: Object.values(nodes), edges: Object.values(edges)}

//     let data = demoData
    
//     loader.load( '../fonts/optimer_bold.typeface.json', function ( resFont ) {

// 		font = resFont;
	
// 		for (var index = 0; index < nodes.length; index++) {

// 			var nodeItem =  nodes[index]
// 			var nodeIndex = 0
// 			var mesh = new THREE.Mesh()
// 			mesh.drawType = "nodeGroup"
// 			mesh.position.x = index*2000 - 4000

// 			while(nodeIndex<nodeItem.length){

// 				var nodeInfo = addNode(nodeItem[nodeIndex].table, index, nodeIndex, 0)
// 				if(!nodeInfo.isExist){
// 					mesh.add(drawNode(nodeInfo.node))
// 				}
				
// 				if(nodeItem[nodeIndex].child_tables&&nodeItem[nodeIndex].child_tables.length>0){
// 					nodeItem[nodeIndex].child_tables.forEach(function(child, childIndex){
// 						var childNodeInfo = addNode(child,index,nodeIndex,childIndex)
// 						if(!childNodeInfo.isExist){
// 							mesh.add(drawNode(childNodeInfo.node))
// 						}
// 						mesh.add(drawLine(nodeInfo.node, childNodeInfo.node))
// 					})
// 				}
// 				nodeIndex++
// 			}

// 			scene.add(mesh)
// 		}
// 	})
    
// }

// let createGraph = ()=>{
//     renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     // renderer.localClippingEnabled = true;
// 	document.body.appendChild( renderer.domElement );

// 	scene = new THREE.Scene();
// 	scene.background = new THREE.Color(0xfefefe)

// 	camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 2000, 1000000)
//     camera.position.z = 12000
//     camera.zoom = 0.5
// }

// // 列表对象
// class TableList{
//     constructor(tables, dom){
//         this.tables = tables;
//         this.dom = dom;
//         this.keywords = '';
//         this.render();
//     }

//     filter(keywords){
//         this.keywords = keywords;
//         this.render();
//     }

//     render(){
//         let htmls = [];
//         this.tables.filter(t => {
//             return t.name.indexOf(this.keywords) >= 0 || t.cname.indexOf(this.keywords) >= 0;
//         }).forEach(t => {
//             htmls.push(`<div class='item' onclick="window.showGraph('${t.name}')">
//                 <p class='cname'>
//                     <span>${t.cname}</span>
//                 </p>
//                 <p class='name'>
//                     <span>(${t.ups-1} | ${t.downs-1})</span>
//                     <span> ${t.name}</span>
//                 </p> 
//             </div>`);
//         });

//         this.dom.innerHTML = htmls.join('')
//     }
// }

// window.showGraph = (id)=>{
//     renderGraph(id)
// }

// (async ()=>{

//     /** 
//      * 初始化数据，存入文件
//     */

//     // let tableData = await createList();

//     // list = tableData.list
//     // counts = tableData.results

//     /** 
//      * 初始化图，列表，绑定筛选
//     */

//     scene = createGraph();
    
//     let tableList = new TableList([
//         {cname:"带看明细记录",name:"fact_housedel_showing_detail_da",ups:31,downs:34}
//     ], document.getElementById('table_list'));

//     document.getElementById('table_filter').onchange = (e)=>{
//         tableList.filter(e.target.value);
//     };

// })();
