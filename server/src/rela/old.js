// import csv from 'csv-box';

// import getNodesAndEdges from 'getNodesAndEdges';

// let graph, list, counts;

// // let graph, list = window.tableMap, counts = window.tableArray;


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

//     let addParentRelationships = (key, currentPath) => {
       
//         let current = list[key];
//         if(!current){
//             return;
//         }
//         let nexts = direction === 'down'? current.children: current.parents;
//         if(nexts.length>0){
//             nexts.forEach(nextKey => {
                
//                 let source = nextKey;
//                 let target =  key;
//                 if(source === target){
//                     return;
//                 }

//                 if(direction === 'down'){
//                     source = key;
//                     target = nextKey;
//                 }

//                 let edgeIndex = `${source}-${target}`;

//                 if(!edgeIndexs.includes(edgeIndex) && source in list && target in list){
//                     data.edges.push({source: source, target: target});
//                     edgeIndexs.push(edgeIndex);
//                 }

//                 if(!nodesIndex.includes(nextKey)){
//                     if(!list[nextKey]){
//                         return;
//                     }
//                     data.nodes.push(Object.assign({nodeType:direction},list[nextKey]));
//                     nodesIndex.push(nextKey);

//                     currentPath = currentPath+"|"+nextKey
//                     addParentRelationships(nextKey, currentPath);
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

//     addParentRelationships(id, rootPath);
    
//     nodesIndex = undefined;
 
//     return {data, leafPath};
// }

// // 初始化关系图
// let createGraph = ()=>{
//     G6.registerNode('rect', {
//         getPath(item) {
//             const width = item.id.length * 8 + 10;   // 一半宽
//             const height = 30;  // 一半高
//             // const width = 1;   // 一半宽
//             // const height = 1;  // 一半高
//             return G6.Util.getRectPath(-width/2, -height/2, width, height, 10);
//         },
//     });

//     G6.registerNode('circle', {
//         draw(item){
//             const group = item.getGraphicGroup();
//             const model = item.getModel();

//             group.addShape('text', {
//                 attrs: {
//                   x: 0,
//                   y: 0,
//                   stroke: '#ccc',
//                   fontSize:14,
//                   textBaseline:'middle',
//                   textAlign:'center',
//                   text: '+'
//                 }
//             });
            
//             return group.addShape('circle', {
//               attrs: {
//                 x: 0,
//                 y: 0,
//                 r: 10,
//                 stroke: '#ccc',
//               }
//             });
//         }
//     });

//     G6.registerBehaviour('tableInfoShow', graph=>{
//         graph.behaviourOn('node:mouseenter', e=>{
//             let model = e.item.getModel()
//             if(model.nodeType!=='open'){
//                 let dom = document.getElementById('table_info')
//                 dom.innerHTML = `
//                                     <p>中文名: ${model.cname}</p>
//                                     <p>表名: ${model.name}</p>
//                                     <p>创建人: ${model.creator}</p>
//                                     <p>描述: ${model.description}</p>
//                                     <p>上游节点: ${list[model.id].ups-1}个</p>
//                                     <p>下游节点: ${list[model.id].downs-1}个</p>
//                                 `;
//                 dom.style.display = 'block'
//             }
            
//         })

//         graph.behaviourOn('node:mousemove', e=>{
//             let model = e.item.getModel()
//             if(model.nodeType!=='open'){
//                 let currentPoint = graph.getDomPoint({
//                     x: e.x,
//                     y: e.y
//                 })
//                 let dom = document.getElementById('table_info')
//                 dom.style.top = `${currentPoint.y - dom.offsetHeight - 20}px`
//                 dom.style.left = `${currentPoint.x - dom.offsetWidth/2}px`
//             }
//         })

//         graph.behaviourOn('node:mouseleave', e=>{
//             let model = e.item.getModel()
//             if(model.nodeType!=='open'){
//                 let dom = document.getElementById('table_info')
//                 dom.innerHTML = ''
//                 dom.style.display = 'none'
//             }
//         });
//     })

//     G6.registerBehaviour('pointer', graph=>{
//         graph.behaviourOn('node:mouseenter', e=>{
//             let model = e.item.getModel()
//             if(model.nodeType==='open'){
//                 document.querySelector('.graph-container').style.cursor = 'pointer'
//             }
            
//         })

//         graph.behaviourOn('node:mouseleave', e=>{
//             let model = e.item.getModel()
//             if(model.nodeType==='open'){
//                 document.querySelector('.graph-container').style.cursor = '-webkit-grab'
//             }
//         });
//     })

    
  
//     const graph =window.g= new G6.Graph({
//         container: 'mountNode',
//         animate: true,
//         // fitView: 'cc',
//         // fitView: 'autoZoom',
//         width: window.innerWidth,
//         height: window.innerHeight,
//         plugins: [new G6.Plugins['layout.dagre']({
//           rankdir: 'LR',
//         })],
//         defaultIntersectBox: 'rect', 
//         modes: {
//           default: ['panCanvas','wheelZoom','tableInfoShow','pointer']
//         },
//       });

//         let styles = {
//             up:{ stroke: '#FFD700', fill:'#333' /*, fillOpacity: 1, lineWidth: 1*/},
//             down:{ stroke: '#5ecaea', fill:'#333'},
//             main:{ stroke: '#FF0000', fill:'#333'}
//         }

//         let labelColor={
//             up: '#FFD700', down: '#5ecaea', main:'#FF0000'
//         }

//       graph.node({
//         shape(model){
//             return model.nodeType!=='open'?'rect':'circle';
//         },
//         label(model) {
//             return model.nodeType!=='open'?{
//                 fill: labelColor[model.nodeType || 'up'],
//                 fontSize: 14,
//                 text: model.id
//             }:{
//                 fill: 'blue',
//                 fontSize: 14,
//                 text: '+'
//             }
//         },
//         style(model){
//             let nodeType = model.nodeType || 'up';
//             return styles[nodeType];
//         }
//       });
//       graph.edge({
//         // shape:'showOpen',
//         style: {
//           endArrow: true
//         },
//       });

//     graph.on('node:click', e=> {
//         if(e.item.getModel().nodeType === 'open'){
//             let source = e.item.getModel().id.split('|')[0]
//             let target = e.item.getModel().id.split('|')[1]

//             let showTarget = source!==graph.currentId?source:target
            
//             renderGraph(graph.currentId, showTarget)
//             graph.focus(showTarget)
//         }else{
//             renderGraph(e.item.getModel().id)
//         }
        
//     });

//     return graph;
// }

// // 绘制以id为中心的节点血缘图
// let renderGraph = (id, leafId) => {
//     console.time('getNodesAndEdges');
//     let data;
//     let isOverCount = ( list[id].ups + list[id].downs > 100 );

//     if(isOverCount){
//         let ups = getAncestorNodes(list, id, 'up');
//         let downs = getAncestorNodes(list, id, 'down');
//         let nodes = [Object.assign({nodeType:'main'},list[id])];
//         let edges = [];

//         console.log(ups,downs)

//         for(let key in ups.leafPath){

//             let openNode = {
//                 nodeType:"open",
//                 id:`${key}|${id}`,
//                 shape:"circle"
//             }

//             if(nodes.map(node=>node.id).indexOf(list[key].id)<0){
//                 nodes.push(Object.assign({isLeaf:true,nodeType:'up'},list[key]))

//                 if(key!==leafId){
//                     nodes.push(openNode)
//                 }
//             }


            
//             if(key!==leafId&&id!==key){
//                 edges.push({source: key,target: `${key}|${id}`})
//                 edges.push({source: `${key}|${id}`,target: id})
//                 // edges.push({
//                 //     source: key,
//                 //     target: id
//                 // })
//             }
//         }

//         for(let key in downs.leafPath){
//             let openNode = {
//                 nodeType:"open",
//                 id:`${id}|${key}`,
//                 shape:"circle"
//             }
//             if(nodes.map(node=>node.id).indexOf(list[key].id)<0){
//                 nodes.push(Object.assign({isLeaf:true,nodeType:'down'},list[key]))
//                 if(key!==leafId){
//                     nodes.push(openNode)
//                 }
//             }
//             if(key!==leafId&&id!==key){
                
//                 edges.push({source: id,target: `${id}|${key}`})
//                 edges.push({source: `${id}|${key}`,target: key})
//                 // edges.push({
//                 //     source: id,
//                 //     target: key
//                 // })
//             }
//         }

//         if(leafId){
//             if(ups.leafPath[leafId]){
//                 for(let i=0;i<ups.leafPath[leafId].length;i++){
//                     let pathArr = ups.leafPath[leafId][i].split("|")
//                     for(let j=0;j<pathArr.length;j++){
//                         let nodeIndex = nodes.map(node=>node.id).indexOf(pathArr[j])
//                         if(nodeIndex<0){
//                             nodes.push(Object.assign({isLeaf:false,nodeType:'up'},list[pathArr[j]]))
//                         }else{
//                             nodes.splice(nodeIndex, 1, Object.assign({isLeaf:false,nodeType:'up'},list[pathArr[j]]))
//                         }
//                         if(j<pathArr.length-1 && edges.map(edge=>`${edge.source}-${edge.target}`).indexOf(`${pathArr[j+1]}-${pathArr[j]}`)<0 && pathArr[j+1]!==pathArr[j]){
//                             edges.push({
//                                 source: pathArr[j+1],
//                                 target: pathArr[j]
//                             })
//                         }
                        
//                     }
//                 }
//             }
//             if(downs.leafPath[leafId]){
//                 for(let i=0;i<downs.leafPath[leafId].length;i++){
//                     let pathArr = downs.leafPath[leafId][i].split("|")
//                     for(let j=0;j<pathArr.length;j++){
//                         let nodeIndex = nodes.map(node=>node.id).indexOf(pathArr[j])
//                         if(nodeIndex<0){
//                             nodes.push(Object.assign({isLeaf:false,nodeType:'down'},list[pathArr[j]]))
//                         }else{
//                             nodes.splice(nodeIndex, 1, Object.assign({isLeaf:false,nodeType:'down'},list[pathArr[j]]))
//                         }
//                         if(j<pathArr.length-1 && edges.map(edge=>`${edge.source}-${edge.target}`).indexOf(`${pathArr[j]}-${pathArr[j+1]}`)<0 && pathArr[j+1]!==pathArr[j]){
//                             edges.push({
//                                 source: pathArr[j],
//                                 target: pathArr[j+1]
//                             })
//                         }
                        
//                     }
//                 }
//             }

//         }

//         data = {nodes, edges}

//     }else{
//         let ups = getAncestorNodes(list, id, 'up');
//         let downs = getAncestorNodes(list, id, 'down');
//         let nodes = [].concat(ups.data.nodes);

//         downs.data.nodes.forEach(node => {
//             for(let i=0, l= nodes.length; i<l; i++){
//                 if(node.id === nodes[i].id){
//                     return;
//                 }
//             }
//             nodes.push(node);
//         })

//         data = {
//             nodes: nodes,
//             edges: [].concat(ups.data.edges).concat(downs.data.edges)
//         }
//     }

//     // console.log(data)
//     console.timeEnd('getNodesAndEdges');

//     graph.currentId = id;
//     graph.clear();
//     graph.read(data);
//     graph.focus(id)
// }

// // 获取CSV中的节点数据
// let createList = async() => {

//     let getCSVData = async ()=>{
//         return await new Promise((resolve, reject) => {
//             csv('./data/table_array.csv', results =>{
//                 resolve(results);
//             }, (error, rows) => {
//                 // console.log(error,rows);
//             });
//         });
//     }

//     let list = {};
//     let results = await getCSVData();

//     // results.forEach(element => {
//     //     let parents = element.parents, children = element.children;
//     //     let table = Object.assign({id: element.name}, element);
//     //     table.parents = parents? parents.replace(/,{2,}/g,',').replace(/(^,+)|(,+$)/g,'').trim().split(','): [];
//     //     table.children = children? children.replace(/,{2,}/g,',').replace(/(^,+)|(,+$)/g,'').trim().split(','): [];
        
//     //     // if(table.parents.length >0 || table.children.length>0)
//     //     list[element.name] = table;
//     // });

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

// //  获取上下游节点数量
// let getUpAndDownCounts = (list) => {
    
//     console.time('getUpAndDownCounts');
//     for(let name in list){
//         let ups = getAncestorNodes(list, name, 'ups').data;
//         let downs = getAncestorNodes(list, name, 'down').data;
//         list[name].ups = ups.nodes.length;
//         list[name].downs = downs.nodes.length;
//     }

//     let array = Object.values(list).sort((a,b) => {
//         return b.ups + b.downs - a.ups - a.downs;
//     });

//     console.timeEnd('getUpAndDownCounts');
    
//     return array;
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


// window.showGraph = (id) => {
//     renderGraph(id);
// }

// (async ()=>{

//     /** 
//      * 初始化数据，存入文件
//     */

//     let tableData = await createList();
//     // // counts = getUpAndDownCounts(list);

//     list = tableData.list
//     counts = tableData.results
    
//     // //  将处理好的数据下载未json文件
//     // let fileContentArray = new Blob([JSON.stringify(counts)], {type: "application/javascript"})
//     // let fileContentList = new Blob([JSON.stringify(list)], {type: "application/javascript"})
//     // let a = document.createElement("a");

//     // a.href = URL.createObjectURL(fileContentArray);
//     // a.download = "table_array";
//     // a.click()

//     // a.href = URL.createObjectURL(fileContentList);
//     // a.download = "table_map";
//     // a.click()

//     /** 
//      * 初始化图，列表，绑定筛选
//     */

//     graph = createGraph();
    
//     let tableList = new TableList(counts, document.getElementById('table_list'));

//     document.getElementById('table_filter').onchange = (e)=>{
//         tableList.filter(e.target.value);
//     };

// })();


