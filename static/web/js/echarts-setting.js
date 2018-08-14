var myChart01 = echarts.init(document.getElementById('chart-id01'))

option01 = {
    title: {
        show:"false",
    },
    xAxis: {
        type: 'category',
        data: ['一', '二', '三', '四', '五', '六', '天']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [8.20, 9.32, 9.01, 9.34, 1.290, 1.330],
        type: 'line'
    }]
};


myChart01.setOption(option01);


var myChart02 = echarts.init(document.getElementById('chart-id02'))
myChart02.title = '坐标轴刻度与标签对齐';

option02 = {
    title: {
        show:"false",
    },
    color: ['#3398DB'],
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
                alignWithLabel: true
            }
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'直接访问',
            type:'bar',
            barWidth: '60%',
            data:[10, 52, 200, 334, 390, 330, 220]
        }
    ]
};


myChart02.setOption(option02);

var myChart03 = echarts.init(document.getElementById('chart-id03'))

var symbolSize = 20;
var data = [[15, 0], [-50, 10], [-56.5, 20], [-46.5, 30], [-22.1, 40]];

option03 = {
    title: {
        // text: false
    },
    tooltip: {
        triggerOn: 'none',
        formatter: function (params) {
            return 'X: ' + params.data[0].toFixed(2) + '<br>Y: ' + params.data[1].toFixed(2);
        }
    },
    grid: {
    },
    xAxis: {
        min: -100,
        max: 80,
        type: 'value',
        axisLine: {onZero: false}
    },
    yAxis: {
        min: -30,
        max: 60,
        type: 'value',
        axisLine: {onZero: false}
    },
    dataZoom: [
        {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'empty'
        },
        {
            type: 'slider',
            yAxisIndex: 0,
            filterMode: 'empty'
        },
        {
            type: 'inside',
            xAxisIndex: 0,
            filterMode: 'empty'
        },
        {
            type: 'inside',
            yAxisIndex: 0,
            filterMode: 'empty'
        }
    ],
    series: [
        {
            id: 'a',
            type: 'line',
            smooth: true,
            symbolSize: symbolSize,
            data: data
        }
    ]
};


if (!myChart03.inNode) {
    setTimeout(function () {
        // Add shadow circles (which is not visible) to enable drag.
        myChart03.setOption({
            graphic: echarts.util.map(data, function (item, dataIndex) {
                return {
                    type: 'circle',
                    position: myChart03.convertToPixel('grid', item),
                    shape: {
                        cx: 0,
                        cy: 0,
                        r: symbolSize / 2
                    },
                    invisible: true,
                    draggable: true,
                    ondrag: echarts.util.curry(onPointDragging, dataIndex),
                    onmousemove: echarts.util.curry(showTooltip, dataIndex),
                    onmouseout: echarts.util.curry(hideTooltip, dataIndex),
                    z: 100
                };
            })
        });
    }, 0);

    window.addEventListener('resize', updatePosition);
}

myChart03.on('dataZoom', updatePosition);

function updatePosition() {
    myChart03.setOption({
        graphic: echarts.util.map(data, function (item, dataIndex) {
            return {
                position: myChart03.convertToPixel('grid', item)
            };
        })
    });
}

function showTooltip(dataIndex) {
    myChart03.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: dataIndex
    });
}

function hideTooltip(dataIndex) {
    myChart03.dispatchAction({
        type: 'hideTip'
    });
}

function onPointDragging(dataIndex, dx, dy) {
    data[dataIndex] = myChart03.convertFromPixel('grid', this.position);

    // Update data
    myChart03.setOption({
        series: [{
            id: 'a',
            data: data
        }]
    });
}






myChart03.setOption(option03);

var myChart04 = echarts.init(document.getElementById('chart-id04'))

option04 = {
    xAxis: {
        data: ['2017-10-24', '2017-10-25', '2017-10-26', '2017-10-27']
    },
    yAxis: {},
    series: [{
        type: 'k',
        data: [
            [20, 30, 10, 35],
            [40, 35, 30, 55],
            [33, 38, 33, 40],
            [40, 40, 32, 42]
        ]
    }]
};


myChart04.setOption(option04);

var myChart05 = echarts.init(document.getElementById('chart-id05'))

var item1 = {
    color: '#F54F4A'
};
var item2 = {
    color: '#FF8C75'
};
var item3 = {
    color: '#FFB499'
};

var data = [{
    children: [{
        value: 5,
        children: [{
            value: 1,
            itemStyle: item1
        }, {
            value: 2,
            children: [{
                value: 1,
                itemStyle: item2
            }]
        }, {
            children: [{
                value: 1
            }]
        }],
        itemStyle: item1
    }, {
        value: 10,
        children: [{
            value: 6,
            children: [{
                value: 1,
                itemStyle: item1
            }, {
                value: 1
            }, {
                value: 1,
                itemStyle: item2
            }, {
                value: 1
            }],
            itemStyle: item3
        }, {
            value: 2,
            children: [{
                value: 1
            }],
            itemStyle: item3
        }, {
            children: [{
                value: 1,
                itemStyle: item2
            }]
        }],
        itemStyle: item1
    }],
    itemStyle: item1
}, {
    value: 9,
    children: [{
        value: 4,
        children: [{
            value: 2,
            itemStyle: item2
        }, {
            children: [{
                value: 1,
                itemStyle: item1
            }]
        }],
        itemStyle: item1
    }, {
        children: [{
            value: 3,
            children: [{
                value: 1
            }, {
                value: 1,
                itemStyle: item2
            }]
        }],
        itemStyle: item3
    }],
    itemStyle: item2
}, {
    value: 7,
    children: [{
        children: [{
            value: 1,
            itemStyle: item3
        }, {
            value: 3,
            children: [{
                value: 1,
                itemStyle: item2
            }, {
                value: 1
            }],
            itemStyle: item2
        }, {
            value: 2,
            children: [{
                value: 1
            }, {
                value: 1,
                itemStyle: item1
            }],
            itemStyle: item1
        }],
        itemStyle: item3
    }],
    itemStyle: item1
}, {
    children: [{
        value: 6,
        children: [{
            value: 1,
            itemStyle: item2
        }, {
            value: 2,
            children: [{
                value: 2,
                itemStyle: item2
            }],
            itemStyle: item1
        }, {
            value: 1,
            itemStyle: item3
        }],
        itemStyle: item3
    }, {
        value: 3,
        children: [{
            value: 1,
        }, {
            children: [{
                value: 1,
                itemStyle: item2
            }]
        }, {
            value: 1
        }],
        itemStyle: item3
    }],
    itemStyle: item1
}];

option05 = {
    series: {
        radius: ['15%', '80%'],
        type: 'sunburst',
        sort: null,
        highlightPolicy: 'ancestor',
        data: data,
        label: {
            rotate: 'radial'
        },
        levels: [],
        itemStyle: {
            color: '#ddd',
            borderWidth: 2
        }
    }
};

myChart05.setOption(option05);

var myChart06 = echarts.init(document.getElementById('chart-id06'))
myChart06.title = '环形图';

option06 = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
    },
    series: [
        {
            name:'访问来源',
            type:'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1548, name:'搜索引擎'}
            ]
        }
    ]
};


myChart06.setOption(option06);







function charts01(){
var myChart = echarts.init(document.getElementById('chart1'))
var dataAxis = ['点', '击', '柱', '子', '或', '者', '两', '指', '在', '触', '屏', '上', '滑', '动', '能', '够', '自', '动', '缩', '放'];
var data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220];
var yMax = 500;
var dataShadow = [];

for (var i = 0; i < data.length; i++) {
    dataShadow.push(yMax);
}

option = {
    title: {
        text: '店铺1',
        // subtext: 'Feature Sample: Gradient Color, Shadow, Click Zoom'
    },
    xAxis: {
        data: dataAxis,
        axisLabel: {
            inside: true,
            textStyle: {
                color: '#fff'
            }
        },
        axisTick: {
            show: false
        },
        axisLine: {
            show: false
        },
        z: 10
    },
    yAxis: {
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            textStyle: {
                color: '#999'
            }
        }
    },
    dataZoom: [
        {
            type: 'inside'
        }
    ],
    series: [
        { // For shadow
            type: 'bar',
            itemStyle: {
                normal: {color: 'rgba(0,0,0,0.05)'}
            },
            barGap:'-100%',
            barCategoryGap:'40%',
            data: dataShadow,
            animation: false
        },
        {
            type: 'bar',
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#83bff6'},
                            {offset: 0.5, color: '#188df0'},
                            {offset: 1, color: '#188df0'}
                        ]
                    )
                },
                emphasis: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#2378f7'},
                            {offset: 0.7, color: '#2378f7'},
                            {offset: 1, color: '#83bff6'}
                        ]
                    )
                }
            },
            data: data
        }
    ]
};

// Enable data zoom when user click bar.
var zoomSize = 6;
myChart.on('click', function (params) {
    console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
    myChart.dispatchAction({
        type: 'dataZoom',
        startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
        endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
    });
});
myChart.setOption(option);

}

function charts02(){
var myChart = echarts.init(document.getElementById('chart1'))
    option = {
    title:{
        text:"店铺2",
    },
    color: ['#3398DB'],
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
                alignWithLabel: true
            }
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'直接访问',
            type:'bar',
            barWidth: '60%',
            data:[10, 52, 200, 334, 390, 330, 220]
        }
    ]
};
myChart.setOption(option);

}

function charts03(){
    var myChart = echarts.init(document.getElementById('chart1'))
    option = {
    title:{
        text:"店铺3",
    },
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
    }]
};
    myChart.setOption(option);

}

function charts04(){
    var myChart = echarts.init(document.getElementById('chart1'))


var posList = [
    'left', 'right', 'top', 'bottom',
    'inside',
    'insideTop', 'insideLeft', 'insideRight', 'insideBottom',
    'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
];

myChart.configParameters = {
    rotate: {
        min: -90,
        max: 90
    },
    align: {
        options: {
            left: 'left',
            center: 'center',
            right: 'right'
        }
    },
    verticalAlign: {
        options: {
            top: 'top',
            middle: 'middle',
            bottom: 'bottom'
        }
    },
    position: {
        options: echarts.util.reduce(posList, function (map, pos) {
            map[pos] = pos;
            return map;
        }, {})
    },
    distance: {
        min: 0,
        max: 100
    }
};

myChart.config = {
    rotate: 90,
    align: 'left',
    verticalAlign: 'middle',
    position: 'insideBottom',
    distance: 15,
    onChange: function () {
        var labelOption = {
            normal: {
                rotate: myChart.config.rotate,
                align: myChart.config.align,
                verticalAlign: myChart.config.verticalAlign,
                position: myChart.config.position,
                distance: myChart.config.distance
            }
        };
        myChart.setOption({
            series: [{
                label: labelOption
            }, {
                label: labelOption
            }, {
                label: labelOption
            }, {
                label: labelOption
            }]
        });
    }
};


var labelOption = {
    normal: {
        show: true,
        position: myChart.config.position,
        distance: myChart.config.distance,
        align: myChart.config.align,
        verticalAlign: myChart.config.verticalAlign,
        rotate: myChart.config.rotate,
        formatter: '{c}  {name|{a}}',
        fontSize: 16,
        rich: {
            name: {
                textBorderColor: '#fff'
            }
        }
    }
};

option = {
    title:{
        text:"店铺4",
    },
    color: ['#003366', '#006699', '#4cabce', '#e5323e'],
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        data: ['Forest', 'Steppe', 'Desert', 'Wetland']
    },
    toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
    calculable: true,
    xAxis: [
        {
            type: 'category',
            axisTick: {show: false},
            data: ['2012', '2013', '2014', '2015', '2016']
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: 'Forest',
            type: 'bar',
            barGap: 0,
            label: labelOption,
            data: [320, 332, 301, 334, 390]
        },
        {
            name: 'Steppe',
            type: 'bar',
            label: labelOption,
            data: [220, 182, 191, 234, 290]
        },
        {
            name: 'Desert',
            type: 'bar',
            label: labelOption,
            data: [150, 232, 201, 154, 190]
        },
        {
            name: 'Wetland',
            type: 'bar',
            label: labelOption,
            data: [98, 77, 101, 99, 40]
        }
    ]
};

    myChart.setOption(option);
}
function charts05(){
    var myChart = echarts.init(document.getElementById('chart1'))

option = {
    title: {
        text: '店铺实时客流量',
        // subtext: '纯属虚构'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#283b56'
            }
        }
    },
    legend: {
        data:['最新人数', '预购队列']
    },
    toolbox: {
        show: true,
        feature: {
            dataView: {readOnly: false},
            restore: {},
            saveAsImage: {}
        }
    },
    dataZoom: {
        show: false,
        start: 0,
        end: 100
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: true,
            data: (function (){
                var now = new Date();
                var res = [];
                var len = 10;
                while (len--) {
                    res.unshift(now.toLocaleTimeString().replace(/^\D*/,''));
                    now = new Date(now - 2000);
                }
                return res;
            })()
        },
        {
            type: 'category',
            boundaryGap: true,
            data: (function (){
                var res = [];
                var len = 10;
                while (len--) {
                    res.push(10 - len - 1);
                }
                return res;
            })()
        }
    ],
    yAxis: [
        {
            type: 'value',
            scale: true,
            name: '价格',
            max: 30,
            min: 0,
            boundaryGap: [0.2, 0.2]
        },
        {
            type: 'value',
            scale: true,
            name: '预购量',
            max: 1200,
            min: 0,
            boundaryGap: [0.2, 0.2]
        }
    ],
    series: [
        {
            name:'预购队列',
            type:'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data:(function (){
                var res = [];
                var len = 10;
                while (len--) {
                    res.push(Math.round(Math.random() * 1000));
                }
                return res;
            })()
        },
        {
            name:'最新人数',
            type:'line',
            data:(function (){
                var res = [];
                var len = 0;
                while (len < 10) {
                    res.push((Math.random()*10 + 5).toFixed(1) - 0);
                    len++;
                }
                return res;
            })()
        }
    ]
};

myChart.count = 11;
setInterval(function (){
    axisData = (new Date()).toLocaleTimeString().replace(/^\D*/,'');

    var data0 = option.series[0].data;
    var data1 = option.series[1].data;
    data0.shift();
    data0.push(Math.round(Math.random() * 1000));
    data1.shift();
    data1.push((Math.random() * 10 + 5).toFixed(1) - 0);

    option.xAxis[0].data.shift();
    option.xAxis[0].data.push(axisData);
    option.xAxis[1].data.shift();
    option.xAxis[1].data.push(myChart.count++);

    myChart.setOption(option);
}, 2100);



    myChart.setOption(option);
}
function charts06(){
    var myChart = echarts.init(document.getElementById('chart1'))

myChart.title = '多 Y 轴示例';

var colors = ['#5793f3', '#d14a61', '#675bba'];

option = {

    title: {
        text: '店铺月份与流量的关系',
        // subtext: '纯属虚构'
    },
    color: colors,

    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        }
    },
    grid: {
        right: '20%'
    },
    toolbox: {
        feature: {
            dataView: {show: true, readOnly: false},
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
    legend: {
        data:['出店量','进店量','平均人流']
    },
    xAxis: [
        {
            type: 'category',
            axisTick: {
                alignWithLabel: true
            },
            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        }
    ],
    yAxis: [
        {
            type: 'value',
            name: '出店量',
            min: 0,
            max: 250,
            position: 'right',
            axisLine: {
                lineStyle: {
                    color: colors[0]
                }
            },
            axisLabel: {
                formatter: '{value} 人/次'
            }
        },
        {
            type: 'value',
            name: '进店量',
            min: 0,
            max: 250,
            position: 'right',
            offset: 80,
            axisLine: {
                lineStyle: {
                    color: colors[1]
                }
            },
            axisLabel: {
                formatter: '{value} 人/次'
            }
        },
        {
            type: 'value',
            name: '时间',
            min: 0,
            max: 24,
            position: 'left',
            axisLine: {
                lineStyle: {
                    color: colors[2]
                }
            },
            axisLabel: {
                formatter: '{value} h'
            }
        }
    ],
    series: [
        {
            name:'出店量',
            type:'bar',
            data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
        },
        {
            name:'进店量',
            type:'bar',
            yAxisIndex: 1,
            data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
        },
        {
            name:'平均人流',
            type:'line',
            yAxisIndex: 2,
            data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
        }
    ]
};



    myChart.setOption(option);
}

$(function(){
 charts01();
})






$(".sectiona .search-box .textin").focus(function(event) {
    /* Act on the event */
    $(".sectiona .search-box .charts").css({
        'display': 'block',
        'opacity': '1'
    });
});

$(".sectiona .search-box .charts").click(function(event) {
    var e = window.event || event;
    var li = e.target;
    var id = $(li).attr('data-id');
    $(".sectiona .search-box .charts").css({
        'display': 'none',
        'opacity': '0'
    });
    var myChart = echarts.init(document.getElementById('chart1'))
    myChart.clear();
    switch (id){
    case "01":
        charts01();
        break;        
    case "02":
        charts02();
        break;        
    case "03":
        charts03();
        break;        
    case "04":
        charts04();
        break;        
    case "05":
        charts05();
        break;        
    case "06":
        charts06();;
        break;        
    }



});
// $(".sectiona .search-box").click(function(event) {
//     /* Act on the event */
//     var e = window.event || event;
//     console.log(e.offsetX,e.offsetY);//容器距离
//     if (e.) {};
//     $(".sectiona .search-box .charts").css({
//         'display': 'none',
//         'opacity': '0'
//     });
// });