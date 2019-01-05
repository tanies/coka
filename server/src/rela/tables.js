
global.canvas = require('canvas')
const jsdoms = require("jsdom");
// console.log(jsdom)
const { JSDOM} = jsdoms;

const { window } = new JSDOM(`<body>
<canvas id="cc"></canvas>
<script>document.body.appendChild(document.createElement("hr"));</script>
</body>`);



console.log(window.document.getElementById('cc').getContext('2d'))
global.window = window
global.document = window.document;
let { HTMLCanvasElement } = window
const $ = require('jQuery')(window);



// window = {
//     innerWidth: 1366,
//     innerHeight: 768,
// }
const csv = require('csv2json');
const G6 = require('@antv/g6')
//console.log(new HTMLCanvasElement)

exports.index = async (createList) => {

    console.log(csv)
    return;



    let graph, list, counts, openNodes = [];

    const showMode = "edge";

    const mainColor = '#555555';
    const lineColor = '#dddddd';

    // document.body.style.backgroundColor = '#333333';

    const maxNodes = 300;

    const nodeStyles = {
        up: '#00FFEC',
        down: '#5ecaea',
        main: '#FC8E02'
    }


    // 获取id的相关nodes和edges
    let getAncestorNodes = (list, id, direction) => {
        direction = direction || 'up';

        if (!list[id]) {
            console.info(`no ${id}`)
            return;
        }

        let data = { nodes: [Object.assign({ nodeType: 'main' }, list[id])], edges: [] };
        let leafPath = {};
        let nodesIndex = [id];
        let edgeIndexs = [];

        let addParentRelationships = (key, findPath, findNode, currentPath) => {

            let current = list[key];
            if (!current) {
                return;
            }
            let nexts = direction === 'down' ? current.children : current.parents;
            if (nexts.length > 0) {
                nexts.forEach(nextKey => {

                    let childCurrentPath = currentPath + "|" + nextKey
                    let childFindNode = findNode
                    let childFindPath = findPath

                    if (childFindNode) {
                        let source = nextKey;
                        let target = key;
                        if (source === target) {
                            childFindNode = false
                            // return
                        } else {
                            if (direction === 'down') {
                                source = key;
                                target = nextKey;
                            }

                            let edgeIndex = `${source}-${target}`;

                            if (!edgeIndexs.includes(edgeIndex) && source in list && target in list) {
                                data.edges.push({ source: source, target: target });
                                edgeIndexs.push(edgeIndex);
                            }

                            if (!nodesIndex.includes(nextKey)) {
                                if (!list[nextKey]) {
                                    childFindNode = false
                                    // return
                                } else {
                                    data.nodes.push(Object.assign({ nodeType: direction }, list[nextKey]));
                                    nodesIndex.push(nextKey);
                                }
                            } else {
                                childFindNode = false
                            }
                        }
                    }

                    if (childFindPath) {
                        let pathArr = currentPath.split('|')
                        let index = pathArr.indexOf(nextKey)
                        if (index < 0) {

                        } else if (index !== pathArr.length - 1) {
                            childFindPath = false
                            if (leafPath[nextKey]) {
                                leafPath[nextKey].push(currentPath)
                            } else {
                                leafPath[nextKey] = [currentPath]
                            }
                        } else {
                            childFindPath = false
                        }
                    }

                    if (childFindNode || childFindPath) {
                        addParentRelationships(nextKey, childFindPath, childFindNode, childCurrentPath);
                    }

                });
            } else {
                if (leafPath[key]) {
                    leafPath[key].push(currentPath)
                } else {
                    leafPath[key] = [currentPath]
                }
            }
        }

        // let getLeafPath = (key, currentPath) => {

        //     let current = list[key];
        //     if(!current){
        //         return;
        //     }
        //     let nexts = direction === 'down'? current.children: current.parents;
        //     if(nexts.length>0){
        //         nexts.forEach(nextKey => {
        //             let childCurrentPath = currentPath+"|"+nextKey
        //             let pathArr = currentPath.split('|')
        //             let index = pathArr.indexOf(nextKey)
        //             if(index<0){
        //                 getLeafPath(nextKey, childCurrentPath);
        //             }else if(index!==pathArr.length-1){
        //                 if(leafPath[nextKey]){
        //                     leafPath[nextKey].push(currentPath)
        //                 }else{
        //                     leafPath[nextKey] = [currentPath]
        //                 }
        //             }

        //         });
        //     }else{
        //         if(leafPath[key]){
        //             leafPath[key].push(currentPath)
        //         }else{
        //             leafPath[key] = [currentPath]
        //         }
        //     }
        // }

        let rootPath = id

        addParentRelationships(id, true, true, rootPath);
        // getLeafPath(id, rootPath);

        nodesIndex = undefined;

        return { data, leafPath };
    }

    // 初始化关系图
    let createGraph = () => {

        // 自定义节点样式
        G6.registerNode('rect', {
            draw(item) {
                const group = item.getGraphicGroup();
                const model = item.getModel();

                const width = item.id.length * 8 + 10;   // 一半宽
                const height = 30;  // 一半高



                //  折叠按钮
                if (openNodes.indexOf(model.id) >= 0 && model.isOverCount) {
                    let x = model.nodeType === 'up' ? (-width / 2 - 20) : (width / 2 + 20);
                    const hide = group.addShape('circle', {
                        attrs: {
                            x,
                            y: 0,
                            r: 15,
                            fill: mainColor,
                            stroke: '#02A9FC'
                        }
                    });
                    group.addShape('text', {
                        attrs: {
                            x,
                            y: 0,
                            stroke: mainColor,
                            fill: '#02A9FC',
                            fontSize: 14,
                            textBaseline: 'middle',
                            textAlign: 'center',
                            text: '-'
                        }
                    });
                }

                const rect = group.addShape('rect', {
                    attrs: {
                        x: -width / 2,
                        y: -height / 2,
                        width,
                        height,
                        radius: 2,
                        fill: model.nodeType === 'main' ? nodeStyles[model.nodeType] : mainColor,
                        stroke: nodeStyles[model.nodeType],
                    }
                });

                const text = group.addShape('text', {
                    attrs: {
                        x: 0,
                        y: 0,
                        fill: model.nodeType === 'main' ? '#fff' : nodeStyles[model.nodeType],
                        stroke: model.nodeType === 'main' ? nodeStyles[model.nodeType] : mainColor,
                        fontSize: 14,
                        textBaseline: 'middle',
                        textAlign: 'center',
                        text: model.id
                    }
                });

                return rect
            }
        });

        // 自定义展开按钮
        G6.registerNode('circle', {
            draw(item) {
                const group = item.getGraphicGroup();
                const model = item.getModel();

                const circle = group.addShape('circle', {
                    attrs: {
                        x: 0,
                        y: 0,
                        r: 15,
                        fill: mainColor,
                        stroke: '#fff',
                    }
                });

                group.addShape('text', {
                    attrs: {
                        x: 0,
                        y: 0,
                        stroke: mainColor,
                        fill: '#fff',
                        fontSize: 14,
                        textBaseline: 'middle',
                        textAlign: 'center',
                        text: model.count
                    }
                });

                return circle
            }
        });

        // 自定义边的样式
        G6.registerEdge('lineButton', {
            draw(item) {
                const keyShape = this.drawKeyShape(item);
                this.drawLabel(item, keyShape);
                return keyShape;
            },
            drawKeyShape(item) {
                const group = item.getGraphicGroup();

                const path = JSON.parse(JSON.stringify(this.getPath(item)));
                return group.addShape('path', {
                    attrs: Object.assign({}, {
                        stroke: lineColor,
                        strokeOpacity: 1,
                        lineAppendWidth: 4,
                        lineWidth: 1,
                    }, {
                            path
                        })
                });
            },
            getPath(item) {
                const points = item.getPoints();
                const path = [
                    ['M', points[0].x, points[0].y]
                ];
                for (let index = 1; index < points.length; index++) {
                    const point = points[index];
                    path.push(['L', point.x, point.y]);
                }
                return path;
            },
            drawLabel(item, keyShape) {

                const group = item.getGraphicGroup();
                const model = item.getModel();

                if (model.count) {

                    let persent = 0.001;
                    let offset;
                    let { minX, maxX } = keyShape.getBBox()
                    let position = model.edgeType === 'up' ? minX + 40 : maxX - 40
                    while (true) {

                        offset = keyShape.getPoint(model.edgeType === 'up' ? persent : 1 - persent)

                        if (!offset) { return }

                        let isOver = model.edgeType === 'up' ? offset.x > position : offset.x < position
                        if (isOver) {
                            break;
                        } else {
                            persent = persent + 0.001;
                        }
                    }

                    model.offset = offset

                    const attrs = Object.assign({}, {
                        text: model.count,
                        fill: '#fff',
                        stroke: mainColor,
                        textAlign: 'center',
                        textBaseline: 'middle'
                    }, offset);

                    let label = group.addShape('text', {
                        class: 'label',
                        attrs
                    });

                    const textBox = label.getBBox();
                    const circle = group.addShape('circle', {
                        attrs: {
                            x: offset.x,
                            y: offset.y,
                            r: 15,
                            fill: mainColor,
                            stroke: "#fff",
                        }
                    });

                    label.toFront()
                }

            },
            endArrow: {
                path(item) {
                    const keyShape = item.getKeyShape();
                    let lineWidth = keyShape.attr('lineWidth');
                    lineWidth = lineWidth > 3 ? lineWidth : 3;
                    const width = lineWidth * 10 / 3;
                    const halfHeight = lineWidth * 4 / 3;
                    const radius = lineWidth * 4;
                    return [
                        ['M', -width, halfHeight],
                        ['L', 0, 0],
                        ['L', -width, -halfHeight],
                        ['A', radius, radius, 0, 0, 1, -width, halfHeight],
                        ['Z']
                    ];
                },
                shorten(item) {
                    const keyShape = item.getKeyShape();
                    const lineWidth = keyShape.attr('lineWidth');
                    return (lineWidth > 3 ? lineWidth : 3) * 3.1;
                },
                style(item) {
                    const keyShape = item.getKeyShape();
                    const {
                        strokeOpacity,
                        stroke
                    } = keyShape.attr();
                    return {
                        fillOpacity: strokeOpacity,
                        fill: stroke
                    };
                },
                tangent(item) {
                    const keyShape = item.getKeyShape();
                    return keyShape.getEndTangent();
                }
            }
        });

        // hover浮层
        G6.registerBehaviour('tableInfoShow', graph => {
            graph.behaviourOn('node:mouseenter', e => {
                let model = e.item.getModel()
                let isNodeRect = model.nodeType === 'up' ? (e.x > model.x - model.width / 2 - 5) : (e.x < model.x + model.width / 2 + 5)
                if (model.nodeType !== 'open' && isNodeRect) {
                    let dom = document.getElementById('table_info')
                    dom.innerHTML = `
                                    <p>中文名: ${model.cname}</p>
                                    <p>表名: ${model.name}</p>
                                    <p>创建人: ${model.creator}</p>
                                    <p>描述: ${model.description}</p>
                                    <p>上游节点: ${list[model.id].ups - 1}个</p>
                                    <p>下游节点: ${list[model.id].downs - 1}个</p>
                                `;
                    dom.style.display = 'block'
                }

            })

            graph.behaviourOn('node:mousemove', e => {
                let model = e.item.getModel();
                if (model.nodeType !== 'open') {
                    let currentPoint = graph.getDomPoint({
                        x: e.x,
                        y: e.y
                    })
                    let dom = document.getElementById('table_info')
                    dom.style.top = `${currentPoint.y - dom.offsetHeight - 20}px`
                    dom.style.left = `${currentPoint.x - dom.offsetWidth / 2}px`
                }
            })

            graph.behaviourOn('node:mouseleave', e => {
                let model = e.item.getModel()
                if (model.nodeType !== 'open') {
                    let dom = document.getElementById('table_info')
                    dom.innerHTML = ''
                    dom.style.display = 'none'
                }
            });
        })

        // 鼠标移到展开折叠按钮时的指针样式
        G6.registerBehaviour('nodePointer', graph => {
            graph.behaviourOn('node:mouseenter', e => {
                let model = e.item.getModel()
                if (model.nodeType === 'open') {
                    document.querySelector('.graph-container').style.cursor = 'pointer'
                } else {
                    let isHideButton = model.nodeType === 'up' ? (e.x < model.x - model.width / 2) : (e.x > model.x + model.width / 2)
                    if (openNodes.indexOf(model.id) >= 0 && isHideButton) {
                        document.querySelector('.graph-container').style.cursor = 'pointer'
                    }
                }

            })

            graph.behaviourOn('node:mouseleave', e => {
                let model = e.item.getModel()
                document.querySelector('.graph-container').style.cursor = '-webkit-grab'
            });
        })

        // 鼠标移到线上的指针样式
        G6.registerBehaviour('edgePointer', graph => {
            graph.behaviourOn('edge:mouseenter', e => {
                let model = e.item.getModel()
                if (model.count > 0 && e.x < model.offset.x + 16 && e.x > model.offset.x - 16 && e.y < model.offset.y + 16 && e.y > model.offset.y - 16) {
                    document.querySelector('.graph-container').style.cursor = 'pointer'
                }
            })

            graph.behaviourOn('edge:mouseleave', e => {
                document.querySelector('.graph-container').style.cursor = '-webkit-grab'
            });
        })

        // 创建图像
        const graph = new G6.Graph({
            container: 'mountNode',
            animate: true,
            width: window.innerWidth,
            height: window.innerHeight,
            plugins: [new G6.Plugins['layout.dagre']({
                rankdir: 'LR',
                nodesep: 50,
                ranksep: 100,
                edgesep: 20
            })],
            defaultIntersectBox: 'rect',
            modes: {
                default: ['panCanvas', 'wheelZoom', 'tableInfoShow', 'nodePointer', 'edgePointer']
            },
        });

        //  引用定义的节点
        graph.node({
            shape(model) {
                return model.nodeType !== 'open' ? 'rect' : 'circle';
            }
        });

        //  edge模式，引用定义的节点
        graph.edge(showMode === 'edge' ? {
            shape: 'lineButton',
            endArrow: true
        } : {
                endArrow: true
            });

        // 节点点击事件
        graph.on('node:click', e => {
            let model = e.item.getModel()
            if (model.nodeType === 'open') {
                renderGraph(graph.currentId, model.target)
            } else {
                let isHideButton = model.nodeType === 'up' ? (e.x < model.x - model.width / 2) : (e.x > model.x + model.width / 2)
                if (isHideButton) {
                    renderGraph(graph.currentId, model.id)
                } else {
                    renderGraph(model.id)
                }
            }
        });

        graph.on('edge:click', e => {
            let model = e.item.getModel()
            if (showMode === 'edge' && model.count > 0 && e.x < model.offset.x + 16 && e.x > model.offset.x - 16 && e.y < model.offset.y + 16 && e.y > model.offset.y - 16) {
                renderGraph(graph.currentId, model.targetNode)
            }
        });

        return graph;
    }

    // 绘制以id为中心的节点血缘图
    let renderGraph = (id, showOrHideleafId) => {

        document.getElementById("loading").style.display = 'block';

        setTimeout(() => {

            console.time('calculateTime')
            let ups = getAncestorNodes(list, id, 'up');
            let downs = getAncestorNodes(list, id, 'down');
            let nodes = {};
            let edges = {};
            let showOrHide = null;

            let isOverCount = (parseInt(list[id].ups) + parseInt(list[id].downs) > maxNodes);

            if (!showOrHideleafId) {
                openNodes = isOverCount ? [] : [].concat(Object.keys(ups.leafPath), Object.keys(downs.leafPath))
            } else {
                let index = openNodes.indexOf(showOrHideleafId)
                if (index < 0) {
                    showOrHide = 'show'
                    openNodes.push(showOrHideleafId)
                } else {
                    showOrHide = 'hide'
                    openNodes.splice(index, 1)
                }
            }


            for (let key in ups.leafPath) {

                nodes[key] = Object.assign({ nodeType: 'up', isOverCount }, list[key])

                let middleNodes = {}
                ups.leafPath[key].forEach(leafPath => {
                    let pathArr = leafPath.split('|')
                    pathArr.forEach(leaf => {
                        if (leaf !== id && leaf !== key) {
                            middleNodes[leaf] = true
                        }
                    })
                })
                let count = Object.keys(middleNodes).length

                if (showMode === 'edge') {
                    if (openNodes.indexOf(key) < 0 && id !== key) {
                        edges[`${key}-${id}`] = { source: key, target: id, edgeType: 'up', count, targetNode: key }
                    }
                } else {
                    if (count) {

                        if (openNodes.indexOf(key) < 0) {
                            nodes[`${key}|${id}`] = {
                                nodeType: "open",
                                id: `${key}|${id}`,
                                shape: "circle",
                                count,
                                target: key
                            }
                        }

                        if (openNodes.indexOf(key) < 0 && id !== key) {
                            edges[`${key}-${key}|${id}`] = { source: key, target: `${key}|${id}` }
                            edges[`${key}|${id}-${id}`] = { source: `${key}|${id}`, target: id }
                        }
                    } else if (id !== key) {
                        edges[`${key}-${id}`] = { source: key, target: id }
                    }
                }
            }

            for (let key in downs.leafPath) {

                nodes[key] = Object.assign({ nodeType: 'down', isOverCount }, list[key])

                let middleNodes = {}
                downs.leafPath[key].forEach(leafPath => {
                    let pathArr = leafPath.split('|')
                    pathArr.forEach(leaf => {
                        if (leaf !== id && leaf !== key) {
                            middleNodes[leaf] = true
                        }
                    })
                })
                let count = Object.keys(middleNodes).length

                if (showMode === 'edge') {
                    if (openNodes.indexOf(key) < 0 && id !== key) {
                        edges[`${id}-${key}`] = { source: id, target: key, edgeType: 'down', count, targetNode: key }
                    }
                } else {
                    if (count) {
                        if (openNodes.indexOf(key) < 0) {
                            nodes[`${id}|${key}`] = {
                                nodeType: "open",
                                id: `${id}|${key}`,
                                shape: "circle",
                                count,
                                target: key
                            }
                        }

                        if (openNodes.indexOf(key) < 0 && id !== key) {
                            edges[`${id}-${id}|${key}`] = { source: id, target: `${id}|${key}` }
                            edges[`${id}|${key}-${key}`] = { source: `${id}|${key}`, target: key }
                        }
                    } else if (id !== key) {
                        edges[`${id}-${key}`] = { source: id, target: key }
                    }
                }

            }


            for (let n = 0; n < openNodes.length; n++) {

                const leafId = openNodes[n];

                if (ups.leafPath[leafId]) {
                    let paths = ups.leafPath[leafId];
                    for (let i = 0; i < paths.length; i++) {
                        let path = paths[i].split("|")
                        for (let j = 0; j < path.length; j++) {

                            nodes[path[j]] = Object.assign({ nodeType: 'up', isOverCount }, list[path[j]])

                            if (j < path.length - 1 && path[j + 1] !== path[j]) {
                                edges[`${path[j + 1]}-${path[j]}`] = {
                                    source: path[j + 1],
                                    target: path[j],
                                    edgeType: 'up',
                                    count: 0
                                }
                            }

                        }
                    }
                }
                if (downs.leafPath[leafId]) {
                    let paths = downs.leafPath[leafId];
                    for (let i = 0; i < paths.length; i++) {
                        let path = paths[i].split("|")
                        for (let j = 0; j < path.length; j++) {

                            nodes[path[j]] = Object.assign({ nodeType: 'down', isOverCount }, list[path[j]])

                            if (j < path.length - 1 && path[j + 1] !== path[j]) {
                                edges[`${path[j]}-${path[j + 1]}`] = {
                                    source: path[j],
                                    target: path[j + 1],
                                    edgeType: 'down',
                                    count: 0
                                }
                            }

                        }
                    }
                }

            }


            nodes[id] = Object.assign({ nodeType: 'main', isOverCount }, list[id])

            let data = { nodes: Object.values(nodes), edges: Object.values(edges) }

            console.timeEnd('calculateTime')

            graph.currentId = id;

            graph.clear();
            console.time("renderTime");
            graph.read(data);
            console.timeEnd("renderTime");

            if (showOrHideleafId) {
                if (showOrHide === 'show') {
                    graph.focus(showOrHideleafId)
                }
            } else {
                graph.focus(id)
            }

            document.getElementById("loading").style.display = 'none';

        }, 1);
    }

    // 获取CSV中的节点数据
    // let createList = async () => {

    //     let getCSVData = async () => {
    //         return new Promise((resolve, reject) => {
    //             console.log(0)
    //             csv('./data/table_array.csv', (results,err) => {
    //                 console.log('++')
    //                 resolve(results);
    //             });
    //         });
    //     }

    //     let list = {};
    //     let results = await getCSVData();
    //     console.log(results, '---')
    //     results = results.map(element => {
    //         let newElement = {}
    //         for (let key in element) {
    //             let newKey = key.replace(/\"/g, '')
    //             newElement[newKey] = element[key]
    //         }
    //         newElement.parents = newElement.parents ? newElement.parents.split(",") : []
    //         newElement.children = newElement.children ? newElement.children.split(",") : []
    //         list[newElement.name] = newElement
    //         return newElement
    //     });


    //     return { list, results };
    // }

    // 列表对象
    class TableList {
        constructor(tables, dom) {
            this.tables = tables;
            this.dom = dom;
            this.keywords = '';
            this.render();
        }

        filter(keywords) {
            this.keywords = keywords;
            this.render();
        }

        render() {
            let htmls = [];
            this.tables.filter(t => {
                if (this.keywords.length > 0 && this.keywords[0] === 'n') {
                    let nodeCount = parseInt(this.keywords.substr(1))
                    if (!isNaN(nodeCount) && nodeCount > 0) {
                        return nodeCount > (parseInt(t.ups) + parseInt(t.downs))
                    }
                } else {
                    return t.name.indexOf(this.keywords) >= 0 || t.cname.indexOf(this.keywords) >= 0;
                }

            }).forEach(t => {
                htmls.push(`<div class='item' onclick="window.showGraph('${t.name}')">
                <p class='cname'>
                    <span>${t.cname}</span>
                </p>
                <p class='name'>
                    <span>(${t.ups - 1} | ${t.downs - 1})</span>
                    <span> ${t.name}</span>
                </p> 
            </div>`);
            });

            this.dom.innerHTML = htmls.join('')
        }
    }


    window.showGraph = (id) => {
        renderGraph(id);
    }


    // (async () => {

    //     /** 
    //      * 初始化数据
    //     */

    let tableData = createList//await createList();
    // console.log(tableData)

    list = tableData.list
    counts = tableData.results

    //     /** 
    //      * 初始化图，列表，绑定筛选
    //     */

    graph = createGraph();

    //     let tableList = new TableList(counts, document.getElementById('table_list'));

    //     document.getElementById('table_filter').onchange = (e) => {
    //         tableList.filter(e.target.value);
    //     };

    //     document.getElementById('table_panel').onmouseover = (e) => {
    //         document.getElementById('table_panel').style.right = "0"
    //     };

    //     document.getElementById('table_panel').onmouseleave = (e) => {
    //         document.getElementById('table_panel').style.right = "-290px"
    //     };

    // })();

}

