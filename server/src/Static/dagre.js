$(function () {
    // var globalPlugin = require('/common/global/index')
    // var rightMenuPlugin = require('/common/rightmenu/index')
    var chartNode = $('#kinship-box')
    var nodes = []
    var links = []
    var dataObj = {}
    var curTableId = '29903';//urlSearch.get('table_id')
    var loading = $('[data-mark="loading"]')
    var placeholder = $('[data-mark="placeholder"]')
    var dir = 'LR'
    var isExpand = false
    var full = false
    var oWidth = $(window).width()
    var oHeight = $(window).height()
    var isPain = false

    //过滤数据
    var filter = function (data, type) {
        var exType = type
        var inner = function (curData, type) {
            var newNode = {
                name: curData.name || 'null',
                table_id: curData.table_id,
                expand: curData.expand
            }
            if (type == 'up' || type == 'down') {
                newNode.type = type
            }
            nodes.push(newNode)

            if (curData.children && curData.children.length > 0) {
                $.each(curData.children, function (index, val) {
                    links.push({
                        from: curData.table_id,
                        to: val.table_id
                    })
                })
                filter(curData.children, 'down')
            }
            if (curData.father && curData.father.length > 0) {
                $.each(curData.father, function (index, val) {
                    links.push({
                        to: curData.table_id,
                        from: val.table_id
                    })
                })
                filter(curData.father, 'up')
            }
        }
        switch (Object.prototype.toString.call(data).slice(8, -1)) {
            case 'Object':
                inner(data, exType)
                break
            case 'Array':
                $.each(data, function (i, item) {
                    inner(item, exType)
                });
                break
        }
    }

    //遍历处理数据
    var traverse = function (cfg) {
        var option = {
            table_id: cfg.table_id
        }
        if (!cfg.all) {
            option.level_down = 1
            option.level_up = 1
        }

        // $.ajax({
        //         url: '/admin/kinship/kinShipChart',
        //         type: 'GET',
        //         dataType: 'json',
        //         data: option,
        //     })
        //     .done(function(res) {
        //         if (res.code == 0) {
        //             if (!res.data || res.data == '') {
        //                 message('无数据')
        //                 loading.hide()
        //                 placeholder.show()
        //                 return
        //             }
        let res = {
            data: JSON.stringify({ "name": "rpt_rushi_vr_housedel_detail_da", "children": null, "father": [{ "name": "dw_pub_code_da", "father": [], "table_id": "10319", "expand": true }, { "name": "dw_hdel_housedel_prospecting_da", "father": [], "table_id": "10629", "expand": true }, { "name": "dw_allinfo_hr_employee_da", "father": [], "table_id": "14686", "expand": true }, { "name": "dw_allinfo_housedel_da", "father": [], "table_id": "15164", "expand": true }, { "name": "dw_hdel_housedel_role_da", "father": [], "table_id": "25301", "expand": true }, { "name": "rpt_rushi_vr_order_detail_da", "father": [], "table_id": "26209", "expand": true }], "table_id": "29903" })

        }
        nodes = []
        links = []
        dataObj = {}
        filter(JSON.parse(res.data))
        dataObj.nodes = nodes
        dataObj.links = links
        dataObj = $.extend(true, dataObj, {
            repain: (cfg.repain || false)
        });
        render.call(window, dataObj)
        //     } else {
        //         message(res.msg)
        //     }
        // })
        // .fail(function(res) {
        //     message(res.msg)
        // })
    }

    //渲染图
    var render = function (data) {
        loading.show()
        var that = this

        if (data.nodes.length === 0) {
            loading.hide()
            placeholder.show()
            return
        }

        if (!isPain || !that.g) {
            that.g = new dagreD3.graphlib.Graph()
                .setGraph({})
                .setDefaultEdgeLabel(function () {
                    return {};
                });
        }

        //设置布局方向
        if (dir && dir == 'LR') {
            that.g.graph().rankdir = 'LR';
        } else {
            that.g.graph().rankdir = 'TB'
        }
        that.g.graph().ranker = 'tight-tree'
        $.each(data.nodes, function (i, t) {
            var typeNo = t.noChild ? 'type-no' : ''
            var curShape = t.expand ? 'ellipse' : 'rect'
            if (t['table_id'] == curTableId) {
                that.g.setNode(t['table_id'], {
                    label: t['name'],
                    class: 'type-cur',
                    shape: 'diamond',
                    id: t['table_id'],
                })
            } else {
                that.g.setNode(t['table_id'], {
                    label: t['name'],
                    shape: curShape,
                    class: "type " + t['type'],
                    id: t['table_id'],
                })
            }
        })

        that.g.nodes().forEach(function (v, i) {
            var node = that.g.node(v);
            node.rx = node.ry = 1;
        });

        $.each(data.links, function (index, item) {
            that.g.setEdge(item.from, item.to, {
                arrowhead: 'vee'
            })
            $('#' + item.from).attr({
                extend: true
            })
        })

        //渲染
        if (!isPain || !that.render) {
            that.render = new dagreD3.render();
            // 设置支持缩放
            that.svg = d3.select("svg");
            var svgGroup = that.svg.append("g");
            that.zoom = d3.behavior.zoom().on("zoom", function () {
                svgGroup.attr("transform", "translate(" + d3.event.translate + ") " +
                    "scale(" + d3.event.scale + ")");
            });
            that.svg.call(that.zoom);
        }

        that.render(d3.select("svg g"), that.g);

        var scaleV, curDiffX, curDiffY, initialScale = 1,
            diffValX, diffValY;

        if (!isPain) {
            isPain = true
            //设置初始化位置
            switch (dir) {
                case 'LR':
                    scaleV = that.svg.attr('height') / that.g.graph().height
                    curDiffX = $('#' + curTableId).attr('transform').slice(10).split(',')[0]
                    curDiffY = $('#' + curTableId).attr('transform').slice(10).split(',')[1].split(')')[0]
                    initialScale = scaleV > 1 ? 1 : scaleV;
                    diffValX = (svg.attr("width") / 2 - curDiffX * initialScale)
                    diffValY = (svg.attr("height") / 2 - curDiffY * initialScale)

                    that.zoom.translate([diffValX, diffValY])
                        .scale(initialScale)
                        .event(that.svg);
                    break
                default:
                    scaleV = that.svg.attr('width') / that.g.graph().width
                    curDiffX = $('#' + curTableId).attr('transform').slice(10).split(',')[0]
                    curDiffY = $('#' + curTableId).attr('transform').slice(10).split(',')[1].split(')')[0]
                    initialScale = scaleV > 1 ? 1 : scaleV;
                    diffValX = (svg.attr("width") / 2 - curDiffX * initialScale)
                    diffValY = (svg.attr("height") / 2 - curDiffY * initialScale)

                    that.zoom.translate([diffValX, diffValY])
                        .scale(initialScale)
                        .event(that.svg);
            }
        }
        // that.svg.attr('height', that.g.graph().height * initialScale);
        if (dir == 'LR') {
            $('[data-mark="switch-dir"]').addClass('on').removeClass('off')
        } else {
            $('[data-mark="switch-dir"]').addClass('off').removeClass('on')
        }

        if (isExpand == true) {
            $('[data-mark="switch-show"]').addClass('off').removeClass('on')
        } else {
            $('[data-mark="switch-show"]').addClass('on').removeClass('off')
        }

        loading.hide()

        var rightMenu = [
            [{
                text: '跳转到该表血缘图',
                func: function () {
                    var curId = $(this).attr('id')
                    if (curId == curTableId) {
                        return
                    }
                    urlSearch.add({
                        'table_id': curId
                    })
                }
            }]
        ]

        // $('.node').smartMenu(rightMenu, {
        //     name: 'link',
        //     beforeShow: function(e) {
        //         eventHandle.removeInfo(e)
        //     }
        // })
    }

    var eventHandle = {
        load: function () {
            var closed = true//urlHash.get('closed')
            var initWidth = parseInt($('.detail-box').width()) || 768;
            if (closed) {
                initWidth = initWidth + 280
            }
            chartNode.attr({
                'width': initWidth,
                'height': parseInt(oHeight - 300)
            })
            // eventHandle.statistical(curTableId)
            setTimeout(function () {
                traverse({
                    table_id: curTableId,
                    all: false
                })
            }, 0)
        },
        statistical: function (table_id) {
            var countNode = $('[data-mark="statistical"]')
            $.ajax({
                url: '/admin/kinship/numStream',
                type: 'GET',
                dataType: 'json',
                data: {
                    table_id: table_id
                },
            })
                .done(function (res) {
                    if (res.code == 0) {
                        countNode.find('.up').text(res.data.direct_upstream || 0)
                        countNode.find('.down').text(res.data.direct_downstream || 0)
                        countNode.find('.up-all').text(res.data.total_upstream || 0)
                        countNode.find('.down-all').text(res.data.total_downstream || 0)
                    } else {
                        message(res && res.msg)
                    }
                })
                .fail(function (res) {
                    message(res && res.msg)
                })
        },
        showInfo: function (e) {
            var that = $(this)
            $('.popover') && $('.popover').remove()

            if (that.attr('data-tip')) {
                var tip = decodeURIComponent(that.attr('data-tip'))
                $(tip).appendTo('body').css({
                    position: 'absolute',
                    left: e.clientX + 5,
                    top: e.clientY - $('.popover').height() / 2
                }).fadeIn('fast')
                return
            }
            var tpl = '';
            $.ajax({
                'url': '/admin/api/tableInfo?table_id=' + that.attr('id'),
                'dataType': 'json',
                'async': false,
                'success': function (res) {
                    if (res.code == 0) {
                        tpl += '表名 : ' + res.data.code + '</br>';
                        tpl += '中文名 : ' + res.data.name + '</br>';
                        tpl += '描述 : ' + res.data.description + '</br>';
                        tpl += '负责人 : ' + res.data.creater;
                    }
                    if ($('.popover').size() > 0) {
                        $('.popover').css({
                            position: 'absolute',
                            left: e.clientX,
                            top: e.clientY - $('.popover').height() / 2
                        }).fadeIn('fast').find('p').html(tpl)
                        return
                    }
                    tpl = '<div class="popover right">' +
                        '<div class="arrow"></div>' +
                        '<h4 class="popover-title">表信息</h4>' +
                        '<div class="popover-content">' +
                        '<p>' + tpl + '</p>' +
                        '</div>' +
                        '</div>';
                    that.attr('data-tip', encodeURIComponent(tpl))
                    $(tpl).appendTo('body').css({
                        position: 'absolute',
                        left: e.clientX + 5,
                        top: e.clientY - $('.popover').height() / 2
                    }).fadeIn('fast')
                }
            });
        },
        removeInfo: function (e) {
            $('.popover').fadeOut('fast');
        },
        move: function (e) {
            var popover = $('.popover')
            if (!popover.is(':visible')) return
            popover.css({
                left: e.clientX + 5,
                top: e.clientY - popover.height() / 2
            })
        },
        reRender: function () {
            isPain = false
            loading.show()
            setTimeout(function () {
                if (full) {
                    chartNode.attr({
                        'width': parseInt($('.detail-box').width()),
                        'height': parseInt(oHeight - 60)
                    })
                    loading.hide()
                } else {
                    chartNode.attr({
                        'width': parseInt($('.detail-box').width()),
                        'height': parseInt(oHeight - 300)
                    })
                    loading.hide()
                }
            }, 0)
        },
        expand: function () {
            var that = $(this)
            var tableId = that.attr('id')
            $('.popover') && $('.popover').remove()
            // if (that.attr('data-clicked')) return
            // $.ajax({
            //     url: '/admin/kinship/kinShipChart',
            //     type: 'GET',
            //     dataType: 'json',
            //     data: {
            //         table_id: tableId,
            //         level_up: 1,
            //         level_down: 1
            //     },
            // })
            //     .done(function (res) {
            //         if (res.code == 0) {
            //             // that.attr('data-clicked', true)
            //             // dataObj.nodes.forEach(function(t, i) {
            //             //     if (t['table_id'] == tableId) {
            //             //         t.clicked = true
            //             //     }
            //             // })

            //             if (!res.data) {
            //                 // that.addClass('type-no')
            //                 // dataObj.nodes.forEach(function(t, i) {
            //                 //     if (t['table_id'] == tableId) {
            //                 //         t.noChild = true
            //                 //     }
            //                 // })
            //                 return
            //             }
                        let res = {
                            data: JSON.stringify({ "name": "dw_hdel_housedel_prospecting_da", "children": [{ "name": "dw_hdel_housedel_manage_da", "children": [], "table_id": "11035", "expand": true }, { "name": "olap_comp_hdel_prospecting_comm_da", "children": [], "table_id": "17455", "expand": false }, { "name": "dw_allinfo_housedel_da", "children": [], "table_id": "15164", "expand": true }, { "name": "anti_stg_observer_static_feature_physical_da", "children": [], "table_id": "19216", "expand": true }, { "name": "dw_allinfo_agent_action_house_manage_di", "children": [], "table_id": "17026", "expand": true }, { "name": "rpt_rushi_vr_prospect_audit_da", "children": [], "table_id": "17208", "expand": false }, { "name": "olap_comp_kpi_offline_hi", "children": [], "table_id": "20273", "expand": false }, { "name": "rpt_beike_del_housedel_role_da", "children": [], "table_id": "21145", "expand": false }, { "name": "olap_lkdy_hdel_action_base_accu_da", "children": [], "table_id": "16100", "expand": true }, { "name": "olap_comp_hdel_prospecting_common_da", "children": [], "table_id": "17879", "expand": false }, { "name": "olap_comp_hdel_action_base_accu_da", "children": [], "table_id": "17106", "expand": true }, { "name": "olap_shh_hdel_housedel_base_da", "children": [], "table_id": "27167", "expand": true }, { "name": "olap_shh_hdel_prospecting_base_da", "children": [], "table_id": "28114", "expand": false }, { "name": "rpt_rushi_vr_housedel_detail_da", "children": [], "table_id": "29903", "expand": false }], "father": [{ "name": "ods_evt_housedel_real_prospecting_da", "father": [], "table_id": "1905", "expand": true }, { "name": "ods_house_zoning_city_da", "father": [], "table_id": "2173", "expand": true }, { "name": "ods_o2o_service_order_da", "father": [], "table_id": "4028", "expand": true }, { "name": "ods_house_sh_house_dic_prospecting", "father": [], "table_id": "3635", "expand": true }, { "name": "ods_house_sh_housedel_da", "father": [], "table_id": "9164", "expand": true }, { "name": "ods_home_house_1_house_prospect_da", "father": [], "table_id": "14707", "expand": true }, { "name": "dw_pub_code_transfer_da", "father": [], "table_id": "16419", "expand": true }, { "name": "stg_hdic_audit_t_flow_log_30000", "father": [], "table_id": "3535", "expand": false }], "table_id": "10629" })

                        }
                        var newData = JSON.parse(res.data)
                        var nodeType = that.hasClass('up') ? 'father' : that.hasClass('down') ? 'children' : null

                        if (nodeType != null) {
                            if (!newData[nodeType] || newData[nodeType] && newData[nodeType].length == 0) {
                                // that.addClass('type-no')
                                dataObj.nodes.forEach(function (t, i) {
                                    if (t['table_id'] == tableId) {
                                        t.noChild = true
                                    }
                                })
                                return
                            }
                            $.each(newData[nodeType], function (i, item) {
                                switch (nodeType) {
                                    case 'father':
                                        dataObj.nodes.push({
                                            name: item.name,
                                            table_id: item.table_id,
                                            type: 'up',
                                            expand: item.expand
                                        })
                                        dataObj.links.push({
                                            from: item.table_id,
                                            to: tableId
                                        })
                                        break
                                    case 'children':
                                        dataObj.nodes.push({
                                            name: item.name,
                                            table_id: item.table_id,
                                            type: 'down',
                                            expand: item.expand
                                        })
                                        dataObj.links.push({
                                            from: tableId,
                                            to: item.table_id
                                        })
                                        break
                                }

                            })
                        }

                        delete dataObj.repain
                        render(dataObj)
                //     } else {
                //         message(res.msg)
                //     }
                // })
                // .fail(function (res) {
                //     message(res.msg)
                // })
        },
        switchExpand: function () {
            isPain = false
            loading.show()
            var that = $(this)
            d3.select("svg g").remove()

            if (that.hasClass('on')) {
                isExpand = true
                // that.addClass('off').removeClass('on')
                traverse({
                    table_id: curTableId,
                    all: true,
                    repain: true
                })
            } else {
                isExpand = false
                // that.addClass('on').removeClass('off')
                traverse({
                    table_id: curTableId,
                    all: false,
                    repain: true
                })
            }
        },
        switchDir: function () {
            if (!dataObj.nodes || dataObj.nodes.length == 0) {
                return
            }
            isPain = false
            loading.show()
            var that = $(this)
            d3.select("svg g").remove()

            if (that.hasClass('on')) {
                dir = 'TB'
                // that.addClass('off').removeClass('on')
            } else {
                dir = 'LR'
                // that.addClass('on').removeClass('off')
            }
            dataObj = $.extend(true, dataObj, {
                repain: true
            });
            render(dataObj)
        },
        switchFull: function () {
            var main = $('.wrapper .main')
            var that = $(this)

            if (that.hasClass('on')) {
                main.addClass('fixed')
                that.removeClass('on').addClass('off')
                full = true
            } else {
                main.removeClass('fixed')
                that.addClass('on').removeClass('off')
                full = false
            }

            eventHandle.reRender()
        },
        drawLine: function () {

        },
    }

    var obj = {
        init: function () {
            eventHandle.load()
            obj.bind()
        },
        bind: function () {
            $(document).on('mouseenter.node', '.node', eventHandle.showInfo)
            $(document).on('mouseleave.node', '.node', eventHandle.removeInfo)
            $(document).on('mousemove.node', eventHandle.move)
            $(window).on('resize', eventHandle.reRender)
            $(document).on('click', '[data-mark="switch-menu"]', eventHandle.reRender)
            $(document).on('click.node', '.node', eventHandle.expand)
            $(document).on('click.show', '[data-mark="switch-show"]', eventHandle.switchExpand)
            $(document).on('click.show', '[data-mark="switch-dir"]', eventHandle.switchDir)
            $(document).on('click.show', '[data-mark="switch-full"]', eventHandle.switchFull)
            $('.frame-main').on('contextmenu', function () {
                return false
            })
            $(document).on('click.line', '.node', eventHandle.drawLine)
        }
    }

    obj.init()

})
