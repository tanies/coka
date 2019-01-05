/**
 * Created by admin on 2018/9/1.
 */
let dagre = require("dagre");
let data = require('../rela/data/table_array')
let fs = require('fs')
let g = new dagre.graphlib.Graph();

//{"id":"stg_hdic_base_new_t_zoning_city_da","name":"stg_hdic_base_new_t_zoning_city_da","cname":"城市表","description":"城市表","level":"生产来源数据","lib_name":"stg","type":"楼盘字典基础库","manager":"李陵【liling@lianjia.com】","creator":"李陵【liling@lianjia.com】","create_time":"2016/3/21 15:37","last_modify_time":"2016/3/21 15:37","business_tag":"其它,","task_cycle":"周","validity":"1","fieds_count":"12","table_security_level":"1","fields_secruity_level":"C级,","enum_fill":"是","has_ai":"否","parents":["ods_hdic_fee_t_matched_data_da","ods_hdic_fee_t_net_sign_base_data_da","ods_house","ods_house_zoning_city_da","dim_geography_id_name_map_day","rpt_loushu_feedback_building","rpt_loushu_feedback_resblock","dw_resblock_show"],"children":[],
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

    let getLeafPath = (key, currentPath) => {

        let current = list[key];
        if (!current) {
            return;
        }
        let nexts = direction === 'down' ? current.children : current.parents;
        if (nexts.length > 0) {
            nexts.forEach(nextKey => {
                let childCurrentPath = currentPath + "|" + nextKey
                let pathArr = currentPath.split('|')
                let index = pathArr.indexOf(nextKey)
                if (index < 0) {
                    getLeafPath(nextKey, childCurrentPath);
                } else if (index !== pathArr.length - 1) {
                    if (leafPath[nextKey]) {
                        leafPath[nextKey].push(currentPath)
                    } else {
                        leafPath[nextKey] = [currentPath]
                    }
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

    let rootPath = id

    addParentRelationships(id, true, true, rootPath);
    getLeafPath(id, rootPath);

    nodesIndex = undefined;

    return { data, leafPath };
}
let list = {}
data.map((val) => {
    list[val.id] = val;
})
// fs.writeFile('./list.js','const list = '+JSON.stringify(list),(err)=>{console.log(err)});

let keys = Object.keys(list)
let len = keys.length
let initRelaData = (nodes, edges) => {


    // Set an object for the graph label
    g.setGraph({
        rankdir: 'RL',
        // nodesep: 50,
        ranksep: 200,
        // edgesep: 20
    });

    // Default to assigning a new object as a label for each new edge.
    g.setDefaultEdgeLabel(function () { return {}; });
    console.time('loop')
    let fontSize = 24
    nodes.map((val, idx) => {
         let width = val.name.length * fontSize+10; //5+5 //左右pading
         g.setNode(val.id, { label: val.name, width, height: 64, nodeType: val.nodeType,name:val.cname });

    })
    edges.map((val, idx) => {
        g.setEdge(val.source, val.target);
    })
    console.timeEnd('loop')
    console.time('layout')
    dagre.layout(g);
    console.timeEnd('layout')

    // console.log(g)
}

let getReladata = (id = 'dw_housedel_housedel_all_info_branch_da') => {
    let ALLUP = getAncestorNodes(list, id, 'up')
    let ALLDOWN = getAncestorNodes(list, id, 'down')

    let nodes = ALLUP.data.nodes.concat(ALLDOWN.data.nodes);
    let edges = ALLUP.data.edges.concat(ALLDOWN.data.edges);

    initRelaData(nodes, edges);

    let datas = {
        nodes: [],
        edges: [],
        edgesId:edges,
        center: {
            centerX: 0,
            centerY: 0
        }
    }


    g.nodes().forEach(function (v) {
        let node = g.node(v);
        if (node.label === id) {
            datas.center = {
                centerX: 0 - node.x,
                centerY: 0 - node.y
            }
            datas.main = node
        }
        datas.nodes.push(node);
    });
    g.edges().forEach(function (e) {
        datas.edges.push(g.edge(e));
    });
    //console.log('_________________',datas.nodes )
    return datas
}
// let datas = getReladata()

let layouts = {};
// let lens = keys.length
// for(let i=lens;i>0;i--){
//     let str = keys[i]+':'+JSON.stringify( getReladata(keys[i]))+','
//     fs.appendFile('../../layouts.js',str,(err)=>{console.log(err)});
//     console.log('-----------',i,'-----------')
// }
// keys.map((val,idx)=>{
//     // if(idx!==2000){return }
//     // let value = getReladata(val);
//     let str = val+':'+JSON.stringify( getReladata(val))+','
//     fs.appendFile('../../layouts.js',str,(err)=>{console.log(err)});
//     console.log('-----------',idx,'-----------')

// })

exports.index = {

    needLogin: true,

    requestHandler: async ctx => {
        let id = ctx.query.id;
        if (id) {
            let datas = await getReladata(id)
            return ctx.ajax({ code: 1, data: datas })
        }

        let da = {}
        // let datas = getReladata()//keys[parseInt(Math.random() * len)])

        return ctx.render('rela', { title: 'loka', datas, da });
    }
} 