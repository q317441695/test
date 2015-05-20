/*!
 * 自动完成控件
 * 创建人：qinnailin
 * 创建时间：2014/8/1
 *
 *
 * 
 */

(function ($) {
    $.fn.autoComplete = function (options) {
        var ops = $.extend({
            url: "",
            data:null,
            source:"",
            value: null,
            key: "id",
            text: "name",
            maxSize: 10,
            width:"auto",
            change: function (obj) { },
            offset:null
        }, options || {});
        var objthis = $(this);
        var data;
        var oldval;
        $(objthis).parent().append("<ul class=\"typeahead dropdown-menu\"></ul>");
        $(this).attr("autocomplete", "off");
        if (ops.width == "auto") {
            $(".dropdown-menu").width($(objthis).width());
        } else if (!isNaN(ops.width)) {
            $(".dropdown-menu").width(ops.width);
        }
        if (ops.offset != null) {
            $(objthis).next(".dropdown-menu").css({ top: ops.offset.Top + "px", left: ops.offset.Left + "px" });
        } 
        /**
        * 输入内容
        * @for autoComplete
        */
        $(objthis).keyup(function () {
            var keyword = $(objthis).val();
            if (keyword == "") {
                if (ops.value) {
                    $("input[name=" + ops.value + "]").val("");
                }
                $(objthis).siblings("ul:first").hide();
                $(objthis).siblings("ul:first li").remove();
                oldval = "";
                return;
            }
            if (oldval != keyword) {
                oldval = keyword;
            } else {
                return false;
            }
            if (ops.data) {
                var d = new Array();
                $.each(ops.data, function (i, n) {
                    if (n[ops.text].indexOf(keyword)>-1) {
                        d.push(n);
                    }
                });
                data = d;
                loadData(d);
            } else if (ops.url != "") {
                var vld = "{" + $(objthis).attr("name") + ":'" + keyword + "'" + ",maxSize:" + ops.maxSize + "}";
                $.get(ops.url, stringToJSON(vld), function (datas) {
                    data = datas;
                    if (ops.source != "") {
                        var temp = datas;
                        var item = ops.source.split('.');
                        $.each(item, function (i, n) {
                            if (n != "") {
                                temp = temp[n];
                            }
                        });
                        data = temp;
                    }
                    loadData(data);
                });
            }
               
        });

        /**
        * 填充数据源
        * @method loadData
        * @param {object} data 数据对象
        * @for autoComplete
        */
        function loadData(data) {
            if (data&&data.length>0) {
                var html = "";
                var temp = "<li style='display:inline'><a data-id='{{" + ops.key + "}}' href='javascript:' >{{" + ops.text + "}}</a></li>";
                for (var i = 0; i < data.length&&i<10; i++) {
                    var n = data[i];
                    html += temp.fill(n);
                }
                $(objthis).siblings("ul:first").html(html).show();
            }
        }
        $(document).ready(function () {
            $(".dropdown").on("click", "ul li a", function () {
                var name = $(this).text();
                var id = $(this).attr("data-id");
                $(objthis).val(name);
                if (ops.value) {
                    $("input[name=" + ops.value + "]").val(id);
                }
                $(objthis).siblings("ul:first").hide();
                $(objthis).focus();
                var row;
                for (var i = 0; i < data.length; i++) {
                    if (data[i][ops.key] == id) {
                        row = data[i];
                        break;
                    }
                }
                oldval = "";
                ops.change(row);
            });
            /**
            * 鼠标移动事件
            * @for autoComplete
            */
            $(".dropdown").on("mousemove", "ul", function () {
                if ($(".dropdown").find(".active").get(0)) {
                    $(".dropdown").find(".active").removeClass("active");
                }
            });
            /**
            * 控制光标游动
            * @for autoComplete
            */
            $(objthis).keyup(function (e) {
                if (event.keyCode == 40) {
                    if ($(".dropdown").find(".active").get(0)) {
                        $(".dropdown").find(".active").removeClass("active").next("li").addClass("active")
                        if (!$(".dropdown").find(".active").get(0)) {
                            $(".dropdown").find("li:first").addClass("active");
                        }
                    } else {
                        $(".dropdown").find("li:first").addClass("active");
                    }
                } else if (event.keyCode == 38) {
                    if ($(".dropdown").find(".active").get(0)) {
                        $(".dropdown").find(".active").removeClass("active").prev("li").addClass("active")
                        if (!$(".dropdown").find(".active").get(0)) {
                            $(".dropdown").find("li:last").addClass("active");
                        }
                    } else {
                        $(".dropdown").find("li:last").addClass("active");
                    }
                } else if (event.keyCode == 13) {
                    var row;
                    var objx
                    if($(".dropdown").find(".active").get(0)){
                        objx = $(".dropdown").find(".active>a").eq(0);
                    }else{
                        objx=$(".dropdown").find("li:first>a");
                    }
                    var name = $(objx).text();
                    var id = $(objx).attr("data-id");
                    $(objthis).val(name);
                    if (ops.value) {
                        $("input[name=" + ops.value + "]").val(id);
                    }
                    $(objthis).siblings("ul:first").hide();
                    $(objthis).focus();
                    for (var i = 0; i < data.length; i++) {
                        if (data[i][ops.key] == id) {
                            row = data[i];
                            break;
                        }
                    }
                    oldval = "";
                    ops.change(row);
                }
            });
        });
    }
})(jQuery);/*!
 * 基础类
 * 创建人：qinnailin
 * 创建时间：2014/7/16 
 *
 *
 * 
 */

var isparent = false;

if (top.location == self.location) {
    isparent = true;
}

//注册message事件
if ('addEventListener' in document) {
    window.addEventListener("message", function (e) {
        var func = e.data;
        if (func && func != "") {
            window.eval(func);
        }
    }, false)
} else if ('attachEvent' in document) {
    window.attachEvent('onmessage', function (e) {
        var func = e.data;
        if (func && func != "") {
            window.eval(func);
        }
    });
}


/**
* 调用跨域函数
* @method crossdomain
* @param {string} funcn 函数名称
* @param {string} val 函数参数
* @for basejs
*/
function crossdomain(funcn, val) {
    if (val != null) {
        var t = typeof (val);
        if (t == "string"&&val!="") {
            val = "'" + val + "'";
        } else {
            val = val + "";
        }
    } else {
        val = "";
    }
    window.parent.postMessage(""+funcn + "(" + val + ")", "*");
}

//页面加载
$(document).ready(function () {

    $(document).ajaxStart(function () {
        try {
            if (loading && !document.getElementById("show-middle-modal-content")) {
                loading(true);
            }
        }catch(e){}
    });
    $(document).ajaxError(function () {
        try {
            if (loading) {
                errormsg("服务器发生错误！！"); 
            }
        } catch (e) { }  
    });
    $(document).ajaxSuccess(function (e, req, s) {
        if (s.dataTypes && s.dataTypes.length > 0 && s.dataTypes[1] == "json") {
            var data = eval('(' + req.responseText + ')');
            if (data.login == true || data.login == "") {
                if (parent.window) {//可以使用模态窗口展现登录
                    parent.window.location.reload();
                } else {
                    window.location.reload();
                }
                return false;
            }
            if (data.utrymsg && data.utrymsg != "") {
                alertui(data.utrymsg);
            }
        }
        
        try {
            if (loading) {
                setTimeout("loading(false)", 500);
            }
        } catch (e) { }
        
    });

    $(window).resize(function () {
        setLayout();
    });

   
    setLayout();
    
    //setTimeout(resertLayout, 500);//延迟500毫秒，防止出现加载过快引起的混乱
});

//防止出现加载过快引起的混乱
function resertLayout() {
    if ($(".main-box").get(0)) {
        var top = getborder($("body"));
        var height = parseFloat($(window).height()) - parseFloat(top);
        var main = $(".main-box").eq(0);
        if ($(".main-box").eq(0).height() != (height - getborder(main))) {
            setLayout();
        }
    }
    if (parseInt($.browser.version) < 8) {
        for (var i = 0; i < 12; i++) {
            if (parseFloat($(".span" + i).width()) > 0)
                $(".span" + i).width(parseFloat($(".span" + i).width() - 1));
        }
        setLayout();
    }
}
//设置布局高度
function setLayout() {
    if ($(".main-box").get(0)) {
        var top = getborder($("body"));
        var height = parseFloat($(window).height()) - parseFloat(top);
        var main = $(".main-box").eq(0);
        $(".main-box").eq(0).height(height - getborder(main));
    }
    if ($(".layout-box").get(0)) {
        $(".layout-box").each(function (i, n) {
            if ($(n).find(".layout-center").get(0)) {
                var firstConter = $(n).find(".layout-center").eq(0);
                findlayout(firstConter);
            }
        });
    }
}
//计算边距
function getborder(obj) {
    return getotborder(obj) + getodborder(obj);
}
 //技术部分边距
function getborderSm(obj) {
    var mt = $(obj).css("margin-top");
    var mb = $(obj).css("margin-bottom");
    var bt = $(obj).css("border-top-width");
    var bb = $(obj).css("border-bottom-width");
    var val = 0;
    if (mt) {
        var v = parseFloat(mt.replace("px", ""));
        if (!isNaN(v))
            val += v;
    }
    if (mb) {
        var v = parseFloat(mb.replace("px", ""));
        if (!isNaN(v))
            val += v;
    }
    if (bt) {
        var v = parseFloat(bt.replace("px", ""));
        if (!isNaN(v))
            val += v;
    }
    if (bb) {
        var v = parseFloat(bb.replace("px", ""));
        if (!isNaN(v))
            val += v;
    }
    return val;
}
//计算左右边框
function getwborder(obj) {
    return getolwborder(obj) + getorwborder(obj);
}

//计算左边框
function getolwborder(obj) {
    var pt = $(obj).css("padding-left");
    var mt = $(obj).css("margin-left");
    var bt = $(obj).css("border-left-width");
    var val = 0;
    if (pt) {
        var v = parseFloat(pt.replace("px", ""));
        if (!isNaN(v))
            val += v;
    }
    if (mt) {
        var v = parseFloat(mt.replace("px", ""));
        if (!isNaN(v))
            val += v;
    }
    if (bt) {
        var v = parseFloat(bt.replace("px", ""));
        if (!isNaN(v))
            val += v;
    }
    return val;
}

//计算右边框
function getorwborder(obj) {
    var pb = $(obj).css("padding-right");
    var mb = $(obj).css("margin-right");
    var bb = $(obj).css("border-right-width");
    var val = 0;
    if (pb) {
        var v = parseFloat(pb.replace("px", ""));
        if (!isNaN(v))
            val += v;
    }
    if (mb) {
        var v = parseFloat(mb.replace("px", ""));
        if (!isNaN(v))
            val += v;
    }
    if (bb) {
        var v = parseFloat(bb.replace("px", ""));
        if (!isNaN(v))
            val += v;
    }
    return val;
}

//计算边距
function getotborder(obj) {
    var pt = $(obj).css("padding-top");
    var mt = $(obj).css("margin-top");
    var bt = $(obj).css("border-top-width");
    var val = 0;
    if (pt) {
        var v = parseFloat(pt.replace("px", ""));
        if (!isNaN(v))
            val += v;
    }
    if (mt) {
        var v = parseFloat(mt.replace("px", ""));
        if (!isNaN(v))
            val += v;
    }
    if (bt) {
        var v = parseFloat(bt.replace("px", ""));
        if (!isNaN(v))
            val += v;
    }
    return val;
}

//计算边距
function getontborder(obj) {
    var mt = $(obj).css("margin-top");
    var bt = $(obj).css("border-top-width");
    var val = 0;
    if (mt) {
        var v = parseFloat(mt.replace("px", ""));
        if (!isNaN(v))
            val += v;
    }
    if (bt) {
        var v = parseFloat(bt.replace("px", ""));
        if (!isNaN(v))
            val += v;
    }
    return val;
}

//计算边距
function getodborder(obj) {
    var pb = $(obj).css("padding-bottom");
    var mb = $(obj).css("margin-bottom");
    var bb = $(obj).css("border-bottom-width");
    var val = 0;
    if (pb) {
        var v = parseFloat(pb.replace("px", ""));
        if (!isNaN(v))
            val += v;
    }
    if (mb) {
        var v = parseFloat(mb.replace("px", ""));
        if (!isNaN(v))
            val += v;
    }
    if (bb) {
        var v = parseFloat(bb.replace("px", ""));
        if (!isNaN(v))
            val += v;
    }
    return val;
}

//计算边距
function getondborder(obj) {
    var mb = $(obj).css("margin-bottom");
    var bb = $(obj).css("border-bottom-width");
    var val = 0;
    if (mb) {
        var v = parseFloat(mb.replace("px", ""));
        if (!isNaN(v))
            val += v;
    }
    if (bb) {
        var v = parseFloat(bb.replace("px", ""));
        if (!isNaN(v))
            val += v;
    }
    return val;
}

//递归计算
function findlayout(obj) {
    var top = $(obj).prev(".layout-top");
    var topH = top.height() + getborder(top);
    var bottom = $(obj).next(".layout-bottom");
    var bottomH = bottom.height() + getborder(bottom);
    var box = $(obj).parents(".layout-box");
    var boxH = box.height() - getborderSm($(box));
    var ch = boxH - bottomH - topH - getborder(obj);
    obj.height(ch);
    if ($(obj).find(".layout-center").get(0)) {
        var center = $(obj).find(".layout-center").eq(0);
        findlayout(center);
    }
}

/**
* 数组删除
* @method fillData
* @param {object} data 数据对象
* @for basejs
*/
Array.prototype.remove = function (dx) {
    if (isNaN(dx) || dx > this.length) {
        return false;
    }
    for (var i = 0, n = 0; i < this.length; i++) {
        if (this[i] != this[dx]) {
            this[n++] = this[i];
        }
    }
    this.length -= 1;
};

/**
* 填充数据源
* @method fillData
* @param {object} data 数据对象
* @for basejs
*/
String.prototype.fill = function (data) {
    if (typeof data === "object" && data) {
        return this.replace(/{{(.+?)}}/g, function (e1, e2) {
            var res = data[e2];
            if (res == undefined || res == null) {
                return e1;
            } else {
                if (typeof (res) == "object") {
                    return stringify(res);
                }else {
                    return res;
                }
            }
        });
    }
};

/**
* 替换指定项
* @method fillData
* @param {string} key 键
* @param {object} value 数据对象
* @for basejs
*/
String.prototype.replaceo = function (key, value) {
    return this.replace("{{" + key + "}}", value);
}

/**
* 获取url键值对
* @method queryString
* @for basejs
*/
var queryString = {
    __init__: function () {
        var paraList = window.location.search.slice(1).split(/\&/g);
        for (var i = 0; i < paraList.length; i++) {
            var pattern = /^(.+)[?=\\=](.+)/g,
              mp = pattern.exec(paraList[i]);
            if (mp) {
                this[mp[1]] = mp[2];
            }
        }
    }
};
queryString.__init__();

function getrequestparam(key) {
    var kv;
    var paraList = window.location.search.slice(1).split(/\&/g);
    for (var i = 0; i < paraList.length; i++) {
        var pattern = /^(.+)[?=\\=](.+)/g,
          mp = pattern.exec(paraList[i]);
        if (mp) {
            kv[mp[1]] = mp[2];
        }
    }
    return kv[key];
}

/**
* json字符串转json对象
* @method stringToJSON
* @param {string} obj 字符串
* @for basejs
*/
function stringToJSON(obj) {
    try {
        return eval('(' + obj + ')');
        //return jQuery.parseJSON(obj);
    } catch (e) {
        alert("你的数据不符合规范！请检查！");
    }
}

/**
* 将json转为字符串
* @method stringify
* @param {object} obj 数据对象
* @for basejs
*/
var stringify = function (obj) {
    //如果是IE8+ 浏览器(ff,chrome,safari都支持JSON对象)，使用JSON.stringify()来序列化
    if (window.JSON) {
        return JSON.stringify(obj);
    }
    var t = typeof (obj);
    if (t != "object" || obj === null) {
        // simple data type
        if (t == "string") obj = '"' + obj + '"';
        return String(obj);
    } else {
        // recurse array or object
        var n, v, json = [], arr = (obj && obj.constructor == Array);

        // fix.
        var self = arguments.callee;

        for (n in obj) {
            v = obj[n];
            t = typeof (v);
            if (obj.hasOwnProperty(n)) {
                if (t == "string") v = '"' + v + '"'; else if (t == "object" && v !== null)
                    // v = jQuery.stringify(v);
                    v = self(v);
                json.push((arr ? "" : '"' + n + '":') + String(v));
            }
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
};

/*!
 * 多级联动
 * 创建人：qinnailin
 * 创建时间：2014/11/14
 *
 *
 * 
 */

!(function ($) {
    "use strict"
    var cascade = function (element, opstions) {
        this.init("cascade", element, opstions);
    }
    cascade.prototype = {
        constructor: cascade,
        init: function (type, element, opstions) {
            this.type = type,
            this.$element = $(element),
            this.opstions = this.getOpstions(opstions);
            this.$id = $(element).attr("id");
            var $this = this;
            if (this.opstions.url == "" && this.opstions.data != null) {
                this.load();
            } else if (this.opstions.url != "") {
                $.getJSON(this.opstions.url, function (data) {
                    $this.opstions.data = data;
                    $this.load();
                });
            }
        },
        getOpstions: function (opstions) {
            return opstions=$.extend({}, $.fn[this.type].defaults, opstions);
        },//加载数据
        load: function () {
            var $this = this;
            this.$items = new Array();
            if ($this.opstions.items) {
                $.each($this.opstions.items, function (i, n) {
                    var selid = $this.$id + "-child-" + i;
                    if (!$("#"+selid).get(0)) {
                        $this.$element.append("<label style=\"float:left;margin:5px;\">" + n.title + ":</label>" +
                            "<div id=\"" + selid + "\" fm-name=\"" + n.name + "\" style=\"float:left;margin-left:5px;\" ></div>");
                    }
                    var sel = $("#" + selid).selectbox({
                        data: [],
                        param: n.param,
                        defaults:null,
                        change: function (id) {
                            $this.change(i,id);
                        }
                    });
                    $this.$items.push(sel);
                });
                $this.$items[0].reload($this.opstions.data[$this.opstions.items[0].name]);
            }
        },//选择改变事件
        change: function (tag, id) {
            if (tag == this.opstions.items.length - 1) return false;
            var data = new Array();
            var item = this.opstions.items[tag + 1];
            var pid = item.pid;
            $.each(this.opstions.data[item.name], function (i, n) {
                if (n[pid] == id) {
                    data.push(n);
                }
            });
            this.$items[tag + 1].reload(data);
        }
    };
    //程序入口
    $.fn.cascade = function (opstions) {
        return this.each(function () {
            var $this = $(this),
            data = $this.data("cascade");
            if (!data) $this.data("cascade", (data = new cascade(this, opstions)));
            if (typeof opstions == "string") {
                $.getJSON(opstions, function (d) {
                    data.opstions.data = d;
                    data.load();
                });
            }
        });
    };
    //默认值
    $.fn.cascade.defaults = {
        url: "",
        data: null,
        items: []
    };
})(window.jQuery);

/*!
 * 图表插件
 * 创建人：qinnailin
 * 创建时间：2014/8/25 
 *
 *
 * 
 */

(function ($) {
    $.extend({
        //初始化
        init: function (opstions) {
            var ops = $.extend(true, {
                'echarts': 'plugIn/charts/echarts',
                'echarts/chart/bar': 'plugIn/charts/echarts-map',
                'echarts/chart/line': 'plugIn/charts/echarts-map',
                'echarts/chart/pie': 'plugIn/charts/echarts-map',
                'echarts/chart/radar': 'plugIn/charts/echarts-map'
            }, opstions);
            require.config({
                paths: ops
            });
        }
    });
    $.fn.extend({
        //柱状图
        bar: function (opstions) {
            var ops = $.extend(true, {
                title: "",
                subtitle: "",
                showtype: 'V',
                data: null,
                url: "",
                afterCreate: null,
                showtag: true,//是否显示标签
                async: {
                    enable:false,
                    url: "",
                    params: {},
                    filer: "Id",
                    name: "-",
                    sleep: 1000,
                    size: 20,
                    insert:false
                }
            }, opstions);
            var objthis = $(this);
            var myChart;
            var lastid;
            if (ops.url != "") {
                $.getJSON(ops.url, function (data) {
                    ops.data = data;
                    var option = loadData();
                    drawing(option);
                });
            } else {
                var option = loadData();
                drawing(option);
            }
            /**
            * 读取数据并渲染
            * @method loadData
            * @for chartjs
            */
            function loadData() {
                var xtype, ytype, xdata, ydata;
                if ((ops.data == null || ops.data.length == 0) && ops.async.enable) {
                    ops.data = $.initEmpty([ops.async.name], ops.async.size);
                }
                if (ops.showtype == "V" || ops.showtype == "v") {
                    xtype = 'category';
                    ytype = 'value';
                    xdata = ops.data.category;
                    ydata = null;
                } else {
                    xtype = 'value';
                    ytype = 'category';
                    xdata = null
                    ydata = ops.data.category;
                }
                var data = new Array();
                var legends = new Array();
                $.each(ops.data.values, function (i, n) {
                    data.push({ name: n.name, type: 'bar', data: n.value });
                    if (ops.async.enable) {
                        lastid = n[ops.async.filer];
                    }
                    legends.push(n.name);
                });

                var option = {
                    title: {
                        text: ops.title,
                        subtext: ops.subtitle
                    },
                    tooltip: {
                        show: true
                    },
                    legend: {
                        data: legends
                    },
                    xAxis: [
                        {
                            type: xtype,
                            data: xdata
                        }
                    ],
                    yAxis: [
                        {
                            type: ytype,
                            data: ydata
                        }
                    ],
                    series: data
                };
                if (!ops.showtag ) {
                    option.legend = null;
                }
                if (!ops.showtag && ops.title == "" && ops.subtitle == "") {
                    option["grid"] = {
                        y: 10,
                        x: 30,
                        y2: 30,
                        x2: 10
                    };
                }
                return option;
            }
            function drawing(option) {
                require(
                [
                    'echarts',
                    'echarts/chart/bar'
                ],
                function (ec) {
                    myChart = ec.init($(objthis).get(0));
                    myChart.setOption(option);
                    if (ops.afterCreate) {
                        ops.afterCreate(myChart);
                    }
                    if (ops.async.enable) {
                        var timeTicket;
                        clearInterval(timeTicket);
                        timeTicket = setInterval(function () {
                            var params = ops.async.params;
                            params["filer"] = lastid;
                            $.getJSON(ops.async.url, params, function (data) {
                                $.each(data, function (i, n) {
                                    myChart.addData([
                                       [
                                           0,        // 系列索引
                                           n.value,       // 新增数据
                                           true,     // 新增数据是否从队列头部插入
                                           ops.async.insert,     // 是否增加队列长度，false则自定删除原有数据，队头插入删队尾，队尾插入删队头
                                           n.key
                                       ]
                                    ]);
                                    lastid = n.value;
                                });
                            });
                        }, ops.async.sleep);
                    }
                });
            }
            var func = {
                reload: function (opst) {
                    if (!myChart) { alertui("请等待图标加载完毕后调用！"); return false; }
                    myChart.clear();
                    if (opst instanceof Object) {
                        ops.data = opst;
                        var option = loadData();
                        myChart.setOption(option);
                        myChart.refresh();
                    } else {
                        ops.data = null;
                        ops.url = opst;
                        $.getJSON(ops.url, function (data) {
                            ops.data = data;
                            var option = loadData();
                            myChart.setOption(option);
                            myChart.refresh();
                        });
                    }
                }
            }
            return func;
        },
        //折线图
        line: function (opstions) {
            var ops = $.extend(true, {
                title: "",
                subtitle: "",
                data: null,
                showtype: 'V',
                url: "",
                symbol: '',//none//节点样式
                smooth: true,//是否平滑显示
                showtag: true,//是否显示标签
                dataZoom: {
                    show: false,
                    realtime: true,
                    start: 0,
                    end: 100
                },
                afterCreate: null,
                async: {
                    enable: false,
                    url: "",
                    params: {},
                    filer: "Id",
                    name:"-",
                    sleep: 1000,
                    size:20,
                    insert: false
                }
            }, opstions);
            var objthis = $(this);
            var myChart;
            var lastid;
            if (ops.url != "") {
                $.getJSON(ops.url, function (data) {
                    ops.data = data;
                    var option = loadData();
                    drawing(option);
                    
                });
            } else {
                var option = loadData();
                drawing(option);
            }
            /**
            * 读取数据并渲染
            * @method loadData
            * @for chartjs
            */
            function loadData() {
                var xAxis, yAxis;

                if ((ops.data == null || ops.data.length == 0) && ops.async.enable) {
                    ops.data = $.initEmpty([ops.async.name], ops.async.size);
                }

                if (ops.showtype == "V" || ops.showtype == "v") {
                    xAxis = { type: 'category', boundaryGap: false, data: ops.data.category };
                    yAxis = { type: 'value' };
                } else {
                    yAxis = { type: 'category', boundaryGap: false, data: ops.data.category };
                    xAxis = { type: 'value' };
                }
                var data = new Array();
                var legends = new Array();//legend=null为不显示
                $.each(ops.data.values, function (i, n) {
                    data.push({ name: n.name, type: 'line', symbol: ops.symbol, smooth: ops.smooth, data: n.value });
                    if (ops.async.enable) {
                        lastid = n[ops.async.filer];
                    }
                    legends.push(n.name);
                });

                var option = {
                    title: {
                        text: ops.title,
                        subtext: ops.subtitle
                    },
                    tooltip: {
                        show: true,
                        trigger: 'axis'
                    },
                    dataZoom: ops.dataZoom,
                    legend: {
                        data: legends
                    },
                    xAxis: [
                        xAxis
                    ],
                    yAxis: [
                        yAxis
                    ],
                    series: data
                };
                if (!ops.showtag ) {
                    option.legend = null;
                }
                if (!ops.showtag && ops.title == "" && ops.subtitle == "") {
                    option["grid"] = {
                        y: 10,
                        x: 30,
                        y2: 30,
                        x2: 10
                    };
                }
                return option;
            }
            function drawing(option) {
                require(
                [
                    'echarts',
                    'echarts/chart/line'
                ],
                function (ec) {
                    myChart = ec.init($(objthis).get(0));
                    myChart.setOption(option);
                    if (ops.afterCreate) {
                        ops.afterCreate(myChart);
                    }
                    if (ops.async.enable) {
                        var timeTicket;
                        clearInterval(timeTicket);
                        timeTicket = setInterval(function () {
                            var params = ops.async.params;
                            params["filer"] = lastid;
                            $.getJSON(ops.async.url, params, function (data) {
                                $.each(data, function (i, n) {
                                    myChart.addData([
                                       [
                                           0,        // 系列索引
                                           n.value,       // 新增数据
                                           true,     // 新增数据是否从队列头部插入
                                           ops.async.insert,     // 是否增加队列长度，false则自定删除原有数据，队头插入删队尾，队尾插入删队头
                                           n.key
                                       ]
                                    ]);
                                    lastid = n.value;
                                });
                            });
                        }, ops.async.sleep);
                    }
                });
            }
            var func = {
                reload: function (opst) {
                    if (!myChart) { alertui("请等待图标加载完毕后调用！"); return false; }
                    myChart.clear();
                    if (opst instanceof Object) {
                        ops.data = opst;
                        var option = loadData();
                        myChart.setOption(option);
                        myChart.refresh();
                    } else {
                        ops.data = null;
                        ops.url = opst;
                        myChart.showLoading();
                        $.getJSON(ops.url, function (data) {
                            ops.data = data;
                            var option = loadData();
                            myChart.setOption(option);
                            myChart.refresh();
                            myChart.hideLoading();
                        });
                    }
                }
            }
            return func;
        },
        //饼图
        pie: function (opstions) {
            var ops = $.extend(true, {
                title: '',
                titleX: "center",
                subtitle: '',
                data: null,
                url: '',
                legendPos: "left",
                showlable:true,
                itemStyle: {
                    normal: {
                        label: { show: true },
                        labelLine: { show: true }
                    }
                },
                afterCreate: null
            }, opstions);
            var objthis = $(this);
            if (ops.url != "") {
                $.getJSON(ops.url, function (data) {
                    ops.data = data;
                    loadData();
                });
            } else {
                loadData();
            }
            
            /**
            * 读取数据并渲染
            * @method loadData
            * @for chartjs
            */
            function loadData() {
                var data = new Array();
                var legends = new Array();
                $.each(ops.data, function (i, n) {
                    legends.push(n.name);
                });

                var dataStyle = {
                    normal: {
                        label: { show: true },
                        labelLine: { show: true }
                    }
                };
                if (!ops.showlable) {
                    dataStyle = {
                        normal: {
                            label: { show: false },
                            labelLine: { show: false }
                        }
                    };
                }
                var option = {
                    title: {
                        text: ops.title,
                        subtext: ops.subtitle,
                        x: ops.titleX
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: ops.legendPos,
                        data: legends
                    },
                    series: [
                        {
                            type: 'pie',
                            itemStyle: dataStyle,
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: ops.data
                        }
                    ]
                };
                require(
                [
                    'echarts',
                    'echarts/chart/pie'
                ],
                function (ec) {
                    var myChart = ec.init($(objthis).get(0));
                    myChart.setOption(option);
                    if (ops.afterCreate) {
                        ops.afterCreate(myChart);
                    }
                });
            }
        },
        //雷达图
        radar: function (opstions) {
            var ops = $.extend(true, {
                title: '',
                subtitle: '',
                style: null,
                data: null,
                url: '',
                afterCreate: null
            }, opstions);
            var objthis = $(this);
            if (ops.url != "") {
                $.getJSON(ops.url, function (data) {
                    ops.data = data;
                    loadData();
                });
            } else {
                loadData();
            }
            /**
            * 读取数据并渲染
            * @method loadData
            * @for chartjs
            */
            function loadData() {
                var data = new Array();
                var legends = new Array();
                $.each(ops.data.values, function (i, n) {
                    legends.push(n.name);
                });

                var areaStyle = {};
                if (ops.style == 'fill') {
                    areaStyle = {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                }

                var option = {
                    title: {
                        text: ops.title,
                        subtext: ops.subtitle
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'right',
                        y: 'bottom',
                        data: legends
                    },
                    polar: [
                       {
                           indicator: ops.data.indicator
                       }
                    ],
                    series: [
                        {
                            type: 'radar',
                            itemStyle: {
                                normal: areaStyle
                            },
                            data: ops.data.values
                        }
                    ]
                };
                require(
                [
                    'echarts',
                    'echarts/chart/radar'
                ],
                function (ec) {
                    var myChart = ec.init($(objthis).get(0));
                    myChart.setOption(option);
                    if (ops.afterCreate) {
                        ops.afterCreate(myChart);
                    }
                });
            }
        },
        //自定义模式(超级模式)
        charts: function (name, option, afterCreate) {
            var objthis = $(this);
            require(
                [
                    'echarts',
                    'echarts/chart/' + name
                ],
                function (ec) {
                    var myChart = ec.init($(objthis).get(0));
                    myChart.setOption(option);
                    if (afterCreate) {
                        afterCreate(myChart);
                    }
                });
        }
    });
    $.extend({
        initEmpty: function (names, size) {
            var titles = new Array();
            var value = new Array();
            for (var i = 0; i < size; i++) {
                titles.push("-");
                value.push(0);
            }
            var values = new Array();
            $.each(names, function (i, n) {
                values.push({ name: n, value: value });
            });
            
            var data = {
                category: titles,
                values: values
            };
            return data;
        }
    });
})(jQuery);
/*!
 * 页面数据填充控件
 * 创建人：qinnailin
 * 创建时间：2014/7/5 
 */

(function ($) {
    $.fn.Detail = function (options) {
        var ops = $.extend({
            data: null,
            url: "",
            source: "",
            idname: "id",
            afterCreate: null
        }, options || {});
        var objthis = $(this);
        var template = $(objthis).html();
        var requrl = "";
        if (queryString[ops.idname]) {
            var urlparam = ops.idname + "=" + queryString[ops.idname];
            if (ops.url.indexOf('?') > -1) {
                requrl = ops.url + "&" + urlparam;
            } else {
                requrl = ops.url + "?" + urlparam;
            }
            loadData();
        } else if (ops.url != "" && ops.data == null) {
            requrl = ops.url;
            loadData();
        } else {
            loadData();
        }
        
        /**
         * 数据加载
         * @method loadData
         * @for Detailjs
         */
        function loadData() {
            if (requrl != "") {
                $.getJSON(requrl, function (rd) {
                    var data;
                    if (ops.source == "") {
                        data = rd;
                    } else {
                        var temp = rd;
                        var item = ops.source.split('.');
                        $.each(item, function (i, n) {
                            if (n != "") {
                                temp = temp[n];
                            }
                        });
                        data = temp;
                    }
                    $(objthis).html(template.fill(data));
                    converfunc();
                    if (ops.afterCreate) {
                        ops.afterCreate();
                    }
                });
            } else if (ops.data) {
                $(objthis).html(template.fill(ops.data));
                converfunc();
            }

        }

        /**
        * 转换控制
        * @method converfunc
        * @for Detailjs
        */
        function converfunc() {
            var clist = $(objthis).find("[fm-conver]");
            $.each(clist, function (i, n) {
                var txt = $(n).html()
                var convfn = $(n).attr("fm-conver");
                var fn = eval(convfn)
                var cvres = fn(txt);
                $(n).html(cvres);
            });
        }

        /**
        * 方法组
        * @for Detailjs
        */
        var func = {
            load: function (obj) {
                if (obj instanceof Object) {
                    requrl = "";
                    ops.data = obj;
                    loadData();
                } else {
                    var urlparam = ops.idname + "=" + obj;
                    if (ops.url.indexOf('?') > -1) {
                        requrl = ops.url + "&" + urlparam;
                    } else {
                        requrl = ops.url + "?" + urlparam;
                    }
                    loadData();
                }
            },
            reload: function () {
                loadData();
            },
            refresh: function () {
                window.location.reload();
            }
        }
        return func;
    }
})(jQuery);/*!
 * js上传控件
 * 创建人：qinnailin
 * 创建时间：2014/9/10
 *
 * 
 */

(function ($) {
    $.fn.extend({
        jsUpload: function (opstion) {
            var objthis = $(this);
            var ops = $.extend(true, {
                element: $(objthis).get(0),
                debug: false,
                multiple: false,
                maxConnections: 3,
                showStart: true,
                autoUpload: false,
                request: {
                    endpoint: '/data/upload.aspx',
                    params: {},
                    customHeaders: {},
                    forceMultipart: false,
                    inputName: 'qqfile'
                },
                validation: {
                    allowedExtensions: [],
                    sizeLimit: 2 * 1024 * 1024,
                    minSizeLimit: 0,
                    stopOnFirstInvalidFile: true
                },
                showMessage: function (message) {
                    if (typeof alertui == "function") {
                        alertui(message);
                    } else {
                        alert(message);
                    }
                }
            }, opstion);
            if (!ops.showStart) {
                var oufun = ops.callbacks.onUpload;
                ops.callbacks.onUpload = function (id, fileName, xhr) {
                    meddleloading(true);
                    if (oufun) oufun(id, fileName, xhr);
                }
                var oucp = ops.callbacks.onComplete;
                ops.callbacks.onComplete = function (id, fileName, data) {
                    if (oucp) oucp(id, fileName, data);
                    meddleloading(false);
                }
            }
            //创建对象
            var uploader = new qq.FineUploader(ops);
            $(document).ready(function () {
                $(objthis).on("click", ".qq-doupload-button", function () {
                    uploader.uploadStoredFiles();
                });
            });
            if (!ops.showStart) {
                $(uploader._listElement).hide();
            }
            return uploader;
        }
    });
})(jQuery);
/*!
 * 手风琴菜单
 * 创建人：qinnailin
 * 创建时间：2014/8/10 
 *
 *
 * 
 */

(function ($) {
    $.fn.FoldMenu = function (options) {
        var ops = $.extend(true, {
            url: "",
            data: null,
            source: "",
            child: "Child",
            key: "Id",
            text: "Name",
            width: 220,
            selected: function (key) { }
        }, options);
        var objthis = $(this);
        $(objthis).addClass("fm-fold").css("width", ops.width);

        loadData();
        /**
         * 数据加载
         * @method loadData
         * @for FoldMenu
         */
        function loadData() {
            if (ops.url == "" && ops.data != null) {
                fillData();
            } else if (ops.url != "") {
                $.getJSON(ops.url, function (rd) {
                    var temp = rd;
                    var item = ops.source.split('.');
                    $.each(item, function (i, n) {
                        if (n != "") {
                            temp = temp[n];
                        }
                    });
                    ops.data = temp;
                    fillData();
                });
            }
        }

        /**
         * 填充数据
         * @method fillData
         * @for FoldMenu
         */
        function fillData() {
            var html = "<ul class=\"menu-one\" " + (ops.width != 220 ? "style='width:" + ops.width + "px'" : '') + ">";
            var li = "<li " + (ops.width != 220 ? "style='width:" + ops.width + "px'" : '') + " ><div class=\"header\"><span class=\"txt\">{{" + ops.text + "}}</span><span class=\"arrow\"></span></div>{{childs}}</li>";
            $.each(ops.data, function (i, n) {
                html += li.fill(n).replaceo("childs", fillChild(n[ops.child]));
            });
            html += "</ul>";
            $(objthis).html(html);
            setDefault();
        }

        /**
         * 填充子数据
         * @method fillChild
         * @param {object} child 子节点对象
         * @for FoldMenu
         */
        function fillChild(child) {
            if (child && child.length > 0) {
                var html = "<ul class=\"menu-two\" " + (ops.width != 220 ? "style='width:" + ops.width + "px'" : '') + " >";
                var li = "<li " + (ops.width != 220 ? "style='width:" + ops.width + "px'" : '') + "  ><a href=\"javascript:\" data-sel=\"{{Selected}}\" data-id=\"{{" + ops.key + "}}\" >{{" + ops.text + "}}</a></li>";
                $.each(child, function (i, n) {
                    html += li.fill(n);
                });
                html += "</ul>";
                return html;
            } else {
                return "";
            }
        }

        /**
         * 设置默认选择
         * @method setDefault
         * @for FoldMenu
         */
        function setDefault() {
            $(objthis).find("a").each(function (i, n) {
                if ($(n).attr("data-sel").toUpperCase() == "TRUE") {
                    $(n).parents("ul").show();
                    $(n).parents("li").addClass("menu-show")
                    ops.selected($(n).attr("data-id"));
                    return;
                }
            });
            $(objthis).find("li").eq(0).addClass("firstChild");
            $(objthis).find("ul").each(function (i, n) {
                $(n).find("li").eq(0).addClass("firstChild");
            });
        }

        /**
         * 页面加载完毕
         * @method ready
         * @for FoldMenu
         */
        $(document).ready(function () {
            $(objthis).on("click", ".header", function () {
                if ($(this).parent("li").hasClass("menu-show")) {
                    $(this).next("ul").slideUp(300);
                    $(this).parent("li").removeClass("menu-show");
                } else {
                    $(this).next("ul").slideDown(300);
                    $(this).parent("li").addClass("menu-show");
                }
                $(this).parent("li").siblings("li").removeClass("menu-show").find("ul").slideUp(300);
            });

            $(objthis).on("click", "a", function () {
                var key = $(this).attr("data-id");
                ops.selected(key);
            });
        });

        var fnc = {

        }

        return fnc;
    }
})(jQuery);/*!
 * form表单验证及初始化
 *创建人：qinnailin
 * 创建时间：2014/7/16 
 *
 *
 标签说明：
 fm-form="ajax" form使用ajax提交数据 不加入标签为普通提交
 fm-null="用户名不能为空！" 空验证
 fm-len="4,20,用户名长度必须大于4小于20！"  字符长度验证，
 fm-ajax="/user/has,用户名已存在!"  ajax验证
 fm-eq="pwd,两次输入密码不一致！" 相等验证 pwd为对比标签的name
 fm-reg="\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*,请输入正确的邮箱格式！" 正则表达式验证
 fm-group="radio,请选择性别！"  radio组验证 fm-group在radio外层
 fm-group="checkbox,2,4,请任选2项！最多4项！" checkbox 组验证 fm-group在checkbox外层
 fm-neq="-1,请选择地区!" 非验证 值不等于 -1
 * 
 */


(function($){
	$.fn.Form=function(options){
		var ops=$.extend(true, {
			url:"",
			data:null,
			source:"",
			idname:"id",//url  id
			success: function (data) { infomsg("数据提交成功！"); },
			error: function (data) { errormsg("数据提交失败!") },
			offset:{top:0,left:0},
            afterLoad:null
		}, options);
		var objthis = $(this);
        var requrl = "";
        if (queryString[ops.idname]) {
            var urlparam = ops.idname + "=" + queryString[ops.idname];
            if (ops.url.indexOf('?') > -1) {
                requrl = ops.url + "&" + urlparam;
            } else {
                requrl = ops.url + "?" + urlparam;
            }
            loadData();
        } else if(ops.url!=""&&ops.data==null){
            requrl = ops.url;
            loadData();
        }

        /**
	     * 数据加载
	     * @method loadData
	     * @for Formjs
	     */
	    function loadData() {

	    	if(requrl!=""){
	    		$.getJSON(requrl, function (rd) {
		            var data;
		            if (ops.source == "") {
		                data = rd;
		            } else {
		                var temp=rd;
		                var item = ops.source.split('.');
		                $.each(item, function (i, n) {
		                    if (n != "") {
		                        temp = temp[n];
		                    }
		                });
		                data = temp;
		            }
		            if(data){
		                $(objthis).find('[name]').each(function(i,item){
		                    var name = $(item).attr("name");
		                    if (($(item).is("input[type=checkbox]") || $(item).is("input[type=radio]"))) {
		                        if ($(item).val() == data[name]) {
		                            $(item).attr("checked", true);
		                        } else {
		                            $(item).removeAttr("checked");
		                        }
		                    } else if ($(item).is("input")) {
		                        $(item).val(data[name]);
		                    } else if ($(item).is("select")) {
		                        $(item).find("option[value=" + data[name] + "]").attr("selected", true);
		                    } else {
		                        $(item).html(data[name]);
		                    }
		                });
		            }
		            converfunc();
		            if (ops.afterLoad) {
		                ops.afterLoad(data);
		            }
		        });
	    	}else{
	    	    if (ops.data) {
	    	        var data = ops.data;
	                $(objthis).find('[name]').each(function(i,item){
	                    var name = $(item).attr("name");
	                    if (($(item).is("input[type=checkbox]") || $(item).is("input[type=radio]")) && $(item).val() == data[name]) {
	                        $(item).attr("checked", true);
	                    } else if ($(item).is("input")) {
	                        $(item).val(data[name]);
	                    } else if ($(item).is("select")) {
	                        $(item).find("option[value=" + data[name] + "]").attr("selected", true);
	                    } else {
	                        $(item).html(data[name]);
	                    }
	                });
	            }
	            converfunc();	
	    	}
	        
	    }

	    /**
	    * 转换控制
	    * @method converfunc
	    * @for Formjs
	    */
	    function converfunc() {
	        var clist = $(objthis).find("[fm-conver]");
	        $.each(clist, function (i, n) {
	            if ($(n).is("input")) {
	                var txt = $(n).val();
	                var convfn = $(n).attr("fm-conver");
	                var fn = eval(convfn);
	                var cvres = fn(txt);
	                $(n).val(cvres);
	            } else {
	                var txt = $(n).html()
	                var convfn = $(n).attr("fm-conver");
	                var fn = eval(convfn)
	                var cvres = fn(txt);
	                $(n).html(cvres);
	            }
	        });
	    }

	    /**
	     * 验证非空
	     * @method vnull
	     * @for Formjs
	     */
	    $.fn.vnull=function () {
	        if ($(this).val() == "") {
	            $(this).showError($(this).attr("fm-null"));
	        } else {
	            $(this).showSuccess();
	        }
	    }

	    /**
	     * 验证长度
	     * @method vlen
	     * @for Formjs
	     */
	    $.fn.vlen = function () {
	        var v = $(this).attr("fm-len").split(",");
	        var min = v[0] ? parseInt(v[0]) : 0;
	        var len = $(this).val().length;
	        if (len < min || (v[1] != "" && len > parseInt(v[1]))) {
	            $(this).showError(v[2]);
	        } else {
	            $(this).showSuccess();
	        }
	    }

	    /**
	     * 验证等于
	     * @method veq
	     * @for Formjs
	     */
	    $.fn.veq = function () {
	        var v = $(this).attr("fm-eq").split(",");
	        var tagv = $("[name=" + v[0] + "]").val();
	        if ($(this).val() != tagv) {
	            $(this).showError(v[1]);
	        } else {
	            $(this).showSuccess();
	        }
	    }

	    /**
	     * 验证组
	     * @method vgroup
	     * @for Formjs
	     */
	    $.fn.vgroup = function () {
	        var v = $(this).attr("fm-group").split(",");
	        if (v[0] == "radio") {
	            var radio = $(this).find("input:radio:checked").val();
	            if (!radio) {
	                $(this).removeClass("success").addClass("error");
	                $(this).showError(v[1]);
	            } else {
	                $(this).removeClass("error").addClass("success");
	                $(this).showSuccess();
	            }
	        } else if (v[0] == "checkbox") {
	            var size = $(this).find("input:checked").size();
	            if ((v[1] != "" && size < parseInt(v[1])) || (v[2] != "" && size > parseInt(v[2]))) {
	                $(this).removeClass("success").addClass("error");
	                $(this).showError(v[3]);
	            } else {
	                $(this).removeClass("error").addClass("success");
	                $(this).showSuccess();
	            }
	        }
	    }

	    /**
	     * 验证不等于
	     * @method vneq
	     * @for Formjs
	     */
	    $.fn.vneq = function () {
	        var v = $(this).attr("fm-neq").split(",");
	        if ($(this).val() == v[0]) {
	            $(this).showError(v[1]);
	        } else {
	            $(this).showSuccess();
	        }
	    }

	    /**
	     * 验证正则
	     * @method vreg
	     * @for Formjs
	     */
	    $.fn.vreg = function () {
	        var v = $(this).attr("fm-reg").split(",");
	        var msg="";
	        var reqexpstr="";
	        if(v.length>2){
	        	msg=v[v.length-1];
	        	var str=$(this).attr("fm-reg");
	        	reqexpstr=str.substring(0,str.lastIndexOf(","));
	        }else{
	        	msg=v[1];
	        	reqexpstr=v[0];
	        }
	        var r = RegExp(reqexpstr);
	        if (!r.test($(this).val())) {
	            $(this).showError(msg);
	        } else {
	            $(this).showSuccess();
	        }
	    }


	    /**
	     * 验证ajax
	     * @method vajax
	     * @for Formjs
	     */
	    $.fn.vajax = function () {
	        var v = $(this).attr("fm-ajax").split(",");
	        if ($(this).attr("fm-ajax-res") == "false") {
	            var v = $(this).attr("fm-ajax").split(",");
	            $(this).showError(v[1]);
	        } else if ($(this).attr("fm-ajax-res") == "") {
	            valid = false;
	            $(this).showError(v[1]);
	        } 
	    }

	    /**
	    * 验证用户输入合法性
	    * @method validation
	    * @for Formjs
	    */
	    function validation(){
	        valid = true;
	        //$("code").remove();
	    	$(objthis).find("[fm-null]").each(function(i,n){
	    	    $(n).vnull();
	    	});
	    	$(objthis).find("[fm-len]").each(function (i, n) {
	    	    $(n).vlen();
	    	});
	    	$(objthis).find("[fm-eq]").each(function (i, n) {
	    	    $(n).veq();
	    	});
	    	$(objthis).find("[fm-group]").each(function (i, n) {
	    	    $(n).vgroup();
	    	});
	    	$(objthis).find("[fm-neq]").each(function (i,n) {
	    	    $(n).vneq();
	    	});

	    	$(objthis).find("[fm-reg]").each(function (i, n) {
	    	    $(n).vreg();
	    	});

	    	$(objthis).find("[fm-ajax]").each(function (i, n) {
	    	    $(n).vajax();
	    	});

	    }

	    

	    /**
	    * 页面加载完毕
	    * @method ready
	    * @for Formjs
	    */
	    $(document).ready(function () {
	        $(objthis).submit(function () {
	            validation();
	            var valid = $(objthis).find(".error").get(0);
			    if (!valid) {
			        if ($(objthis).attr("fm-form")&&$(objthis).attr("fm-form") == "ajax") {
			            $.ajax({
			                url: this.action,
			                type: this.method,
			                cache: false,
			                data: $(this).serialize(),
			                success: function (result) {
			                    ops.success(result);
			                },
			                error: function (result) {
			                    ops.error(result);
			                }
			            });
			            return false;
			        } else {
			            return true;
			        }
			    } else {
			        return false;
			    }
			    return false;
	        });


            //绑定blur
	        $(objthis).on("blur", "input[fm-ajax]", function () {
	            var oth = $(this);
	            var v = $(oth).attr("fm-ajax").split(",");
	            var key=$(this).attr("name");
	            var val = $(this).val();
	            if(val!=""){
	                var data=key+"="+val;
	                $.ajax({
	                    url: v[0],
	                    type: "get",
	                    data: data,
	                    success: function (result) {
	                        if (result.flag) {
	                            $(oth).attr("fm-ajax-res", "true");
	                            $(this).showSuccess();
	                        } else {
	                            $(oth).showError(v[1]);
	                            $(oth).attr("fm-ajax-res", "false");
	                        }
	                    },
	                    error: function (result) {
	                        $(oth).showError("数据请求失败");
	                        $(oth).attr("fm-ajax-res", "false");
	                    }
	                });
	            }
	        });

	        //绑定blur
	        $(objthis).on("blur", "input", function () {
	            var oth = $(this);
	            var alen = $(oth).get(0).attributes.length;
	            for (var i = 0; i < alen; i++) {
	                var name = $(oth).get(0).attributes[i].name;
	                switch (name) {
	                    case "fm-null":
	                        $(oth).vnull();
	                        break;
	                    case "fm-len":
	                        $(oth).vlen();
	                        break;
	                    case "fm-eq":
	                        $(oth).veq();
	                        break;
	                    case "fm-neq":
	                        $(oth).vneq();
	                        break;
	                    case "fm-reg":
	                        $(oth).vreg();
	                        break;
	                    default:
	                }
	            }
	        });
	        //绑定blur
	        $(objthis).on("blur", "textarea", function () {
	            var oth = $(this);
	            var alen = $(oth).get(0).attributes.length;
	            for (var i = 0; i < alen; i++) {
	                var name = $(oth).get(0).attributes[i].name;
	                switch (name) {
	                    case "fm-null":
	                        $(oth).vnull();
	                        break;
	                    case "fm-len":
	                        $(oth).vlen();
	                        break;
	                    default:
	                }
	            }
	        });
	        //绑定blur
	        $(objthis).on("blur", "select", function () {
	            var oth = $(this);
	            var alen = $(oth).get(0).attributes.length;
	            for (var i = 0; i < alen; i++) {
	                var name = $(oth).get(0).attributes[i].name;
	                switch (name) {
	                    case "fm-neq":
	                        $(oth).vneq();
	                        break;
	                    default:
	                }
	            }
	        });
	       
	        //绑定focus
	        $(objthis).on("focus", "input", function () {
	            $(this).removeError();
	        });
	        $(objthis).on("click", "input:radio", function () {
	            $(this).parent(".error").removeError();
	        });
	        $(objthis).on("click", "input:checkbox", function () {
	            $(this).parent(".error").removeError();
	        });
	        //绑定focus
	        $(objthis).on("focus", "textarea", function () {
	            $(this).removeError();
	        });
	        //绑定focus
	        $(objthis).on("focus", "select", function () {
	            $(this).removeError();
	        });

	        //绑定change
	        $(objthis).on("change", "input", function () {
	            $(this).removeError();
	        });
	        //绑定change
	        $(objthis).on("change", "textarea", function () {
	            $(this).removeError();
	        });
	        //绑定change
	        $(objthis).on("change", "select", function () {
	            $(this).removeError();
	        });
		});

        /**
        * 方法组
        * @for Formjs
        */
        var func = {
            load:function(opst){
            	if(opst instanceof Object){
                    ops.data=opst;
                    requrl="";
                    loadData();
                }else{
                    var urlparam = ops.idname + "=" + id;
	                if (ops.url.indexOf('?') > -1) {
	                    requrl = ops.url + "&" + urlparam;
	                } else {
	                    requrl = ops.url + "?" + urlparam;
	                }
	                loadData();
                }
            },
            reload: function () {
                window.location.reload();
            },
            refresh: function () {
                loadData();
            },
            reset:function(){
                $(objthis)[0].reset();
                $(objthis).find("input").val("");
            },
            closemsg: function () {
                $("div.u_warn").remove();
            },
            validation: function () {
                $(objthis).find(".error").removeClass("error");
                validation();
                return !$(objthis).find(".error").get(0);
            }
        }
        return func;
	}
    /**
	    * 输出错误
	    * @method showError
	    * @for Formjs
	    */
	$.fn.showError = function (msg) {
	    $(this).removeClass("error").addClass("error");
	    $(this).attr("data-title", msg).Tooltip({
	        placement: "bottom",
	        template: '<div class="tooltip form"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
	    });
	}
    /**
    * 显示正确信息
    * @method showSuccess
    * @for Formjs
    */
	$.fn.showSuccess = function () {
	    $(this).removeClass("error");
	    $(this).attr("data-title", "");
	    $(".tooltip").remove();
	}
    /**
    * 移除提示信息
    * @method removeError
    * @for Formjs
    */
	$.fn.removeError = function () {
	    $(this).removeClass("error");
	    $(this).attr("data-title", "");
	    $(".tooltip").remove();
	}
})(jQuery);/*!
 * 列表控件 带分页的表格控件
 *创建人：qinnailin
 * 创建时间：2014/7/4 
 */

(function ($) {
    $.fn.Grid = function (options) {
        var ops = $.extend(true,{
            url: "",
            data: null,
            dataformat: {data:"Data",count:"Count"},
            click: null,
            dbclick: null,
            method: "Get",
            dataType: "json",
            sortMultiple: true,
            putJson: true,
            cache:true,
            page: {
                click:null,
                pageSize: 30,
                pageIndex: 1,
                back: "上一页",
                next: "下一页",
                reqindex: "pageindex",
                reqsize: "pagesize",
                lazy: null
            },
            afterLoad:null
        }, options );

        var objthis = $(this);
        var thisid = $(objthis).attr("id");
        var template;
        var ajaxData;
        if (!document.getElementById(thisid + "_template")) {
            template = findTemp(objthis, ops);
            $("body").append("<script type='text/template' id='" + thisid + "_template' >" + template + "</script>");
        } else {
            template = $("#" + thisid + "_template").html();
        }
        var tempbox = findTempBox(objthis);
        tempbox.html("");
        var pagecount = 0;
        var listcount = 0;
        var pageIndex = 1;
        var requesturl = "";
        var sortdata = {};

        /**
         * 方法组
         */
        var func = {
            reload: function () {
                pageIndex = 1;
                if ($(objthis).find("[fm-pagerbox]").get(0)) {
                    $(objthis).find("[fm-pagerbox]").find(".pageindex").text(1);
                }
                initReqUrl();
                loaddata();
            },
            refresh: function () {
                ops.data = null;
                loaddata();
            },
            load:function(opst){
                if(opst instanceof Object){
                    ops.data=opst;
                } else {
                    ops.data = null;
                     ops.url=opst;
                 }
                pageIndex = 1;
                initReqUrl();
                loaddata();
            },
            getData:function(){
                return ops.data;
            },
            getAjaxData: function () {
                return ajaxData;
            }
        }
        /**
         * 初始化请求url
         * @method initReqUrl
         * @for Gridjs
         */
        function initReqUrl(){
            var pagediv=$(objthis).find('[fm-pagerbox]').html();
            if(pagediv!=undefined){
                var urlparam = ops.page.reqindex + "=" + ((ops.page.pageIndex - 1) + pageIndex) + "&" + ops.page.reqsize + "=" + ops.page.pageSize;
                if (ops.url.indexOf('?')>-1) {
                    requesturl = ops.url + "&" + urlparam;
                } else {
                    requesturl = ops.url + "?" + urlparam;
                }
            }else{
                requesturl=ops.url;
            }
            
        }
        initReqUrl();

        loaddata();
        /**
         * 数据加载
         * @method loaddata
         * @for Gridjs
         */
        function loaddata() {
            if (ops.url == "" && ops.data != null) {
                //$(tempbox).html(fillData(ops, template));
                fillData(ops, template);
                if (ops.page.lazy) {
                    ops.url = ops.page.lazy.url;
                    listcount = ops.page.lazy.count;
                    bindPager();
                }
                converfunc();
                if (ops.afterLoad) {
                    ops.afterLoad();
                }
            } else if (ops.url != "") {
                var value = $(objthis).find("[fm-search]").serialize();
                var daval;
                if (ops.putJson) {
                    if (value) {
                        var sstr = value.split("&");
                        var temp = new Array();
                        for (var i = 0; i < sstr.length; i++) {
                            var v = sstr[i].split("=")
                            if (v[1]) {
                                temp.push(v[0] + ":'" + v[1] + "'");
                            }
                        }
                        daval = temp.join(",");
                        daval = "{jsonStr:\"{" + daval + "}\",sort:'" + stringify(sortdata) + "'}"
                        daval = eval("(" + daval + ")");
                    } else if (jsonsize(sortdata) > 0) {
                        daval = "{sort:'" + stringify(sortdata)+ "'}";
                        daval = stringToJSON(daval);
                    }
                } else {
                    if (!$(objthis).find("form[fm-search]").get(0)) {
                        $(objthis).append("<form fm-search ></form>");
                    }
                    if ($(objthis).find("form[fm-search]").find("input[name=sort]").get(0)) {
                        if (jsonsize(sortdata)>0)
                            $(objthis).find("form[fm-search]").find("input[name=sort]").val(stringify(sortdata));
                    } else {
                        if (jsonsize(sortdata) > 0) {
                            $(objthis).find("form[fm-search]").append("<input type='hidden' name='sort' value='" + stringify(sortdata) + "' />");
                        }
                    }
                    daval = $(objthis).find("[fm-search]").serialize();
                }
                $.ajax({
                    url: requesturl,
                    data: daval,
                    type: ops.method,
                    dataType: ops.dataType,
                    cache:ops.cache,
                    success: function (result) {
                        try {
                            if (result.utrymsg && result.utrymsg != "") {
                                return false;
                            }
                        } catch (e) {
                        }
                        ajaxData = result;
                        listcount = result[ops.dataformat.count];
                        ops.data = result[ops.dataformat.data];
                        fillData(ops, template);
                        converfunc();
                        var pager=$(objthis).find("[fm-pagerbox]").html();
                        if (pager != undefined) {
                            pagecount = GetCountPage(listcount, ops.page.pageSize);
                            $(objthis).find("[fm-pagerbox]").find(".pagecount").text(pagecount);
                            if (pagecount == pageIndex) {
                                $(objthis).find("[fm-pagerbox]").find(".next").addClass("active");
                            } else {
                                $(objthis).find("[fm-pagerbox]").find(".next").removeClass("active");
                            }
                        }
                        if (ops.afterLoad) {
                            ops.afterLoad(result);
                        }
                    },
                    error: function (result) {
                        errormsg("数据获取失败！");
                    }
                });
            }
        }

        /**
         * 分页绑定
         * @method bindPager
         * @for Gridjs
         */
        function bindPager() {
            var pages = '<p class="page_num"><a href="javascript:" class="page_pre back"></a>' +
            '<span class="fir_page pageindex">1</span><span class="line_page">/</span><span class="las_page pagecount">1</span>' +
            '<a href="javascript:" class="page_nex next"></a><input type="text" class="goTo_page" />' +
            '<input type="button" class="btn gotobtn" value="跳页" /></p>';
            $(objthis).find("[fm-pagerbox]").html(pages);
        }

        /**
         * 转换控制
         * @method converfunc
         * @for Gridjs
         */
        function converfunc() {
            var clist = $(objthis).find("[fm-conver]");
            $.each(clist, function (i, n) {
                var txt = $(n).html()
                var convfn = $(n).attr("fm-conver");
                var fn = eval(convfn)
                var cvres = fn(txt);
                $(n).html(cvres);
            });
        }

        /**
         * 页面加载
         * @for Gridjs
         */
        $(document).ready(function () {
            bindPager();
            if (ops.click != null) {
                $(objthis).on("click", "[fm-row]", function () {
                    var id = $(this).attr("fm-row");
                    var data = ops.data[id];
                    ops.click(data);
                });
            }
            if (ops.dbclick != null) {
                $(objthis).on("dblclick", "[fm-row]", function () {
                    var id = $(this).attr("fm-row");
                    var data = ops.data[id];
                    ops.dbclick(data);
                });
            }
            $(objthis).on("click", "[fm-pagerbox]>p>a", function () {
                if ($(this).hasClass("active")) return;
                if ($(this).hasClass("back")) {
                    if (pageIndex == 1) {
                        $(this).addClass("active");
                        return;
                    }
                    if (--pageIndex > 1) {
                        $(this).removeClass("active");
                    }
                    
                    $(objthis).find("[fm-pagerbox]").find(".next").removeClass("active");
                    $(objthis).find("[fm-pagerbox]").find(".pageindex").text(pageIndex);
                    bindPageEvent();
                } else if ($(this).hasClass("next")) {
                    if (++pageIndex < pagecount) {
                        $(this).removeClass("active");
                    }
                    $(objthis).find("[fm-pagerbox]").find(".back").removeClass("active");
                    $(objthis).find("[fm-pagerbox]").find(".pageindex").text(pageIndex);
                    bindPageEvent();
                } 
            });

            $(objthis).on("click", "[fm-pagerbox]>p>.gotobtn", function () {
                var val = parseInt($(objthis).find("[fm-pagerbox]>p>input.goTo_page").val());
                if (pageIndex != val&&val>=ops.page.pageIndex&&val<=pagecount) {
                    pageIndex = val;
                    initReqUrl();
                    loaddata();
                }
                $(objthis).find("[fm-pagerbox]").find(".pageindex").text(pageIndex);
            });

            $(objthis).find("form[fm-search]").eq(0).submit(function () {
                func.reload();
                return false;
            });

            $(objthis).find("[fm-sort]").addClass("sort_head");

            $(objthis).find("[fm-sort]").each(function (i,n) {
                $(n).append("<a class='sort_pre_next' ></a>");
            });

            $(objthis).on("click", "[fm-sort]", function () {
                if (!ops.sortMultiple) {
                    $(this).siblings("[fm-sort]").children("a").removeClass("sort_pre").remove("sort_next").addClass("sort_pre_next");
                }
                var value = -1;
                var oth = $(this).children("a");
                if ($(oth).hasClass("sort_pre_next")) {
                    $(oth).removeClass("sort_pre_next").addClass("sort_pre");
                    value = 0;
                } else if ($(oth).hasClass("sort_pre")) {
                    $(oth).removeClass("sort_pre").addClass("sort_next");
                    value = 1;
                } else if ($(oth).hasClass("sort_next")) {
                    $(oth).removeClass("sort_next").addClass("sort_pre_next");
                    value = -1;
                }
                sortsetdata($(this), value);
            });

        });

        /**
         * json大小
         * @method jsonsize
         * @for Gridjs
         */
        function jsonsize(obj) {
            var count = 0;
            for (var i in obj) {
                count++;
            }
            return count;
        }

        /**
         * 设置排序参数
         * @method sortsetUrl
         * @for Gridjs
         */
        function sortsetdata(obj,val) {
            if (!ops.sortMultiple) {
                sortdata = {};
            }
            var key = $(obj).attr("fm-sort");
            sortdata["\""+key+"\""] = val;
            if (val = -1) {
                try { delete sortdata[key]; } catch (e) { }//只有在非ie和ie9以上才不会报错
            }
            pageIndex = 1;
            initReqUrl();
            if ($(objthis).find("[fm-pagerbox]").get(0)) {
                $(objthis).find("[fm-pagerbox]").find(".pageindex").text(1);
            }
            var str = stringify(sortdata).replace(/\\"/g, "");
            sortdata = stringToJSON(str);
            loaddata();
        }

        

        /**
         * 点击分页
         * @method pageChange
         * @for Gridjs
         */
        function pageChange() {
            initReqUrl();
            loaddata();
        }

        /**
        * 分页绑定事件
        * @method bindPageEvent
        * @for Gridjs
        */
        function bindPageEvent() {
            pageChange();
            if (ops.page.click != null) {
                ops.page.click(pageIndex);
            }
        }
        /**
    * 计算页数
    * @method GetCountPage
    * @param {int} pageCount 数据总项数
    * @param {int} pageSize 分页大小
    * @for Gridjs
    */
        function GetCountPage(pageCount, pageSize) {
            if (pageCount < pageSize) {
                return 1;
            } else if (pageCount > 0) {
                if (pageCount % pageSize == 0) {
                    return maxpage = pageCount / pageSize;
                } else {
                    return parseInt((pageCount / pageSize)) + 1;
                }
            }
            return 0;
        }

        /**
        * 填充数据
        * @method fillData
        * @param {object} ops 控件参数对象
        * @param {string} template 填充模版
        * @for Gridjs
        */
        function fillData(ops, template) {
            var d = ops.data;
            $(tempbox).empty();
            if (d && d.length > 0) {
                try {
                    $.each(d, function (i, n) {
                        $(tempbox).append($(template.fill(n).replaceo("fm-row-num", i)).data("jsondata",n));
                    });
                } catch (e) {
                    console.debug(template);
                    console.debug(e);
                }
            }
        }

        /**
        * 添加行标（获取行号）
        * @method setTempRow
        * @param {object} temp jquery对象
        * @for Gridjs
        */
        function setTempRow(temp) {
            var obj = $(temp).attr("fm-row", "{{fm-row-num}}").get(0);
            var div = document.createElement("div");
            div.appendChild(obj);
            return $(div).html();
        }

        /**
        * 查找模版
        * @method fillData
        * @param {object} obj jquery对象
        * @param {object} ops 控件参数对象
        * @for Gridjs
        */
        function findTemp(obj, ops) {
            var temphtml = $(obj).find("[fm-body]").html();
            if (ops.click != null || ops.dbclick != null) {
                temphtml = setTempRow(temphtml);
            }
            return temphtml;
        }

        /**
        * 查找模板外壳
        * @method fillData
        * @param {object} obj jquery对象
        * @for Gridjs
        */
        function findTempBox(obj) {
            return $(obj).find("[fm-body]");
        }
        return func;
    }

    

})(jQuery);

/*!
 * uGTree表格树控件 不用表格做，肯定有问题
 * 创建人：qinnailin
 * 创建时间：2015/1/5 
 */

!(function ($) {
    "use strict"
    var uGTree = function (element, options) {
        this.init("uGTree", element, options);
    }//对象
    uGTree.prototype = {
        init: function (type, element, options) {
            var ops;
            this.type = type,
            this.$element = $(element),
            this.$id = $(element).attr("id"),
            this.options=ops = this.getoptions(options),
            this.tempBox = this.getTempBox(),
            this.template = this.getTemp();
            this.tempBox.addClass("fm-ulgtree");
            this.tempBox.html("");
            this.loadData();
            this.bevents ;
            var $this = this;
            this.tempBox.on("click", "span.switch", function () {
            	
                var obj = $(this).parents("li").eq(0);
                var chk = $(this).siblings("span.chk").hasClass("checkbox_true_full_focus");
                if (!obj.children("div").hasClass("t_open")) {
                    var data = obj.data("rowdata");
                    console.debug($this.options.dataFormat.open);
                    if (data[$this.options.dataFormat.open]) {
                        var pk = "";
                        if (ops.param) {
                            pk = "{";
                            var array = new Array();
                            $.each(ops.param, function (i, n) {
                                array.push("'" + ops.param[i] + "':'" + data[ops.param[i]] + "'");
                            });
                            pk += array.join(",");
                            pk += "}";
                        }
                        $.getJSON(ops.url, stringToJSON(pk), function (d) {
                            var rd;
                            if (ops.source != "") {
                                var temp = d;
                                var item = ops.source.split('.');
                                $.each(item, function (i, n) {
                                    if (n != "") {
                                        temp = temp[n];
                                    }
                                });
                                rd = temp;
                            }
                            $this.fillAjaxNode(obj, data, rd, chk);
                            $this.open(obj);
                            $this.conver();
                        });
                    } else if (data[$this.options.dataFormat.child]) {
                        $this.fillNode(obj, data, chk);
                        $this.open(obj);
                        $this.conver();
                    } else {
                        $this.open(obj);
                    }
                } else {
                    $this.fold(obj);
                }
                return false;
            });
            this.tempBox.on("click", "span.chk", function () {
                var obj = $(this);
                $this.checked(obj);
                return false;
            });
            this.tempBox.on("click", ".cols", function () {
                if (ops.select) {
                    if (ops.click) {
                        var $li = $(this).parent("li");
                        ops.click($li.data("rowdata"), $li);
                    }
                    $this.selected($(this));
                    return false;
                }
            });
            this.tempBox.on("click", "li", function () {
                if (ops.click) {
                    var $li = $(this);
                    ops.click($li.data("rowdata"), $li);
                }
                return false;
            });
            this.tempBox.on("click", "button", function (e) {
            	
                if ($this.bevents && $this.bevents.length>0) {
                    var $li = $(this).parents("li");
                    var index = $li.find("button").index($(this));
                    $this.bevents[index]($li.data("rowdata"));
                    
                    return false;
                }
            });
        },//参数
        getoptions: function (options) {
            return $.extend({}, $.fn[this.type].defaults, options);
        },//盒子
        getTempBox: function () {
            this.$element.addClass("box-border")
                         .append("<div><ul></ul></div>")
                         .append("<div><ul></ul></div>");
            var $head = this.$element.children("div").eq(0)
            $head.addClass("row-fluid").addClass("ug-head");
            $head.children("ul").addClass("ul_grid_title");
            var $center = this.$element.children("div").eq(1);
            $center.addClass("row-fluid").addClass("ug-body");
            var $ul = $center.children("ul").addClass("ul_grid");
            return $ul;
        },//模板
        getTemp: function () {
            var ops = this.options;
            var $this = this;
            var iconTemp = "<span class=\"line\" {{layer}} ></span><span class=\"button switch center\"></span>"
            if (ops.treeModel == "checkbox") {
                iconTemp += "<span  class=\"button chk checkbox_false_full\" ></span>";
            }
            iconTemp += "<span {{diyicon}} class=\"button {{icon2}}\"></span>";
            var temp = "<div class='cols t_close' >";
            var htemp = "<li><div class='cols'>";
            if (!ops.header) {
                alert("uGTree标头不可为空！");
                return false;
            }
			var len=ops.header.length;
            $.each(ops.header, function (i, n) {
                var html;
                if (n.tree) {
                    if (n.conver) {
                        html = "<div class='" + (len - 1 == i ? 'last tree' : 'tree') + "'>" + iconTemp + "<span class='text' fm-conver='" + n.conver + "'>{{" + n.key + "}}</span></div>";
                    }else if(n.html){
                        html = "<div class='" + (len - 1 == i ? 'last tree' : 'tree') + "'>" + iconTemp + n.html + "</div>";
                    } else {
                        html = "<div class='" + (len - 1 == i ? 'last tree' : 'tree') + "'>" + iconTemp + "<span class='text'>{{" + n.key + "}}</span></div>";
                    }
                } else if (n.key) {
                    if (n.conver) {
                        html = "<div class='text "+(len-1==i?'last':'')+"' fm-conver='" + n.conver + "' >{{" + n.key + "}}</div>";
                    } else {
                        html = "<div class='text "+(len-1==i?'last':'')+"'>{{" + n.key + "}}</div>";
                    }
                } else if (n.html) {
                    html = "<div class='controll-html "+(len-1==i?'last':'')+"' >"+n.html+"</div>";
                } else if (n.buttons) {
                    var btnhtml = "<div class='"+(len-1==i?'last':'')+"' >";
                    $this.bevents = new Array();
                    $.each(n.buttons, function (j, b) {
                        btnhtml += "<button>" + b.text + "</button>";
                        $this.bevents.push(b.click);
                    });
                    html = btnhtml + "</div>";
                }
                if (n.width) {
                    temp += $(html).css("width", n.width + ops.unit).get(0).outerHTML;
                    htemp += $("<div class='"+(len-1==i?'last':'')+"'>" + n.name + "</div>").css("width", n.width + ops.unit).get(0).outerHTML;
                } else {
                    alert("宽度是必填项！！");
                    return false;
                }
            });
            
            temp += "</div>";
            htemp += "</div></li>";
            $this.$element.find(".ul_grid_title").append(htemp);
            return temp;
        },//加载数据
        loadData: function () {
            var ops = this.options,
            $this = this;
            this.$element.find(".fm-ulgtree").html("");
            if (ops.data != null) {
                $this.fillRoot(ops.data);
                $this.conver();
                if (ops.afterLoad) {
                    ops.afterLoad();
                }
            } else if (ops.url != "") {
                $.getJSON(ops.url, { _r_t: (ops.cache ? 0 : Math.random()) }, function (data) {
                    var resd = data;
                    if (ops.source != "") {
                        var temp = data;
                        var item = ops.source.split('.');
                        $.each(item, function (i, n) {
                            if (n != "") {
                                temp = temp[n];
                            }
                        });
                        resd = temp;
                    }
                    $this.fillRoot(resd);
                    $this.conver();
                    if (ops.afterLoad) {
                        ops.afterLoad();
                    }
                });
            }
        },//root数据
        fillRoot: function (data) {
            var ops = this.options,
                $this = this;
            $.each(data, function (i, n) {
                n["tag_id"] =  i;
                var child = n[ops.dataFormat.child];
                n["icon2"] = "ico" ;
                var html = $this.filltrRootData(n),d = n, count = 0,$li,$chk;
                count = n["tag_id"].toString().split('_').length - 1;
                count = count == -1 ? 0 : count;
                if (ops.expand != 0) {
                    d = $this.copyobject(n);
                }
                html = (n[ops.dataFormat.selected]&&ops.select ? '<li class="selected" >' : '<li>') + html + '</li>';
                var $html = $(html);
                $html.remove().appendTo($this.tempBox);
                $li = $this.tempBox.find("li:last");
                
                $chk = $li.find(".chk");
                if ($chk && n[ops.dataFormat.checked]) {
                    $chk.addClass("checkbox_true_full_focus").removeClass("checkbox_false_full");
                }
                ops.bindNode(n, $li);
                if (child && child.length > 0&&ops.expand!=0) {
                    $this.fillChild(child, $li, "");
                    d[ops.dataFormat.child] = null;
                }
                $li.data("rowdata", d);
                if (ops.expand !=0) {
                    $this.open($html);
                }
            });//子数据
        },
        fillChild: function (data, element, pid) {
            var ops = this.options,
                $this = this, $ul = element.children("ul");
            if (!$ul.get(0)) {
                element.append("<ul></li>");
                $ul = element.children("ul");
            }
            for (var i = 0; i < data.length ; i++) {
                var n = data[i];
                n["tag_id"] = pid + "_" + i;
                var child = n[ops.dataFormat.child];
                n["icon2"] = (child && child.length > 0) ? "ico" : "docu";
                var html = $this.filltrData(n);
                var d = n;
                var count = 0;
                count = n["tag_id"].toString().split('_').length - 1;
                count = count == -1 ? 0 : count;
                html = (n[ops.dataFormat.selected]&&ops.select? '<li class="selected" >':'<li>') + html + '</li>';
                var $html = $(html);
                $html.remove().appendTo($ul);
                var $li = $ul.find("li:last");
                
                var $docu = $li.find(".switch").eq(0), $chk = $li.find(".chk").eq(0);
                if (n["icon2"] == "docu" && !$docu.hasClass("docu")) {
                    $docu.addClass("docu");
                }
                if ($chk && n[ops.dataFormat.checked]){
                    $chk.addClass("checkbox_true_full_focus").removeClass("checkbox_false_full");
                }
                ops.bindNode(n, $li);
                if (child && child.length >= 0 && ops.expand != 0) {
                    if (ops.expand > 0 && count > ops.expand) {
                        $li.data("rowdata", d);
                        continue;
                    } else {
                        $this.fillChild(child, $li, n["tag_id"]);//
                        $this.open($html);
                        d[ops.dataFormat.child] = null;
                        $li.data("rowdata", d);
                    }
                } else {
                    $li.data("rowdata", d);
                }
            }
        },//数据
        fillNode: function (element, d, chk) {
            var ops = this.options,
                $this = this, pid = d.tag_id, data = d[$this.options.dataFormat.child];
            element.data("rowdata", $this.copyobject(d));
            element.append("<ul></ul>");
            var $ul = element.children("ul").eq(0);
            for (var i = 0; i < data.length ; i++) {
                var n = data[i];
                n["tag_id"] = pid + "_" + i;
                var child = n[ops.dataFormat.child];
                n["icon2"] = (child && child.length > 0) || (n[ops.dataFormat.open]) ? "ico" : "docu";
                var html = $this.filltrData(n);
                var d = n;
                html = '<li>' + html + '</li>';
                var $html = $(html);
                if (chk&&ops.multiple) {
                    $html.find(".chk").addClass("checkbox_true_full_focus");
                }
                $ul.append($html);
                var $li = $ul.children("li:last"), $chk;
                var $docu = $li.find(".switch").eq(0);
                if (n["icon2"] == "docu" && !$docu.hasClass("docu")) {
                    $docu.addClass("docu");
                }
                $chk = $li.find(".chk").eq(0);
                if ($chk && n[ops.dataFormat.checked]) {
                    $chk.addClass("checkbox_true_full_focus").removeClass("checkbox_false_full");
                }
                $li.data("rowdata", d);
            }
        },//数据
        fillAjaxNode: function (element, pd, d, chk) {
            var ops = this.options,
                $this = this, pid = pd.tag_id, data = d;
            pd[$this.options.dataFormat.open] = false;
            element.data("rowdata", pd);
            element.append("<ul></ul>");
            var $ul = element.children("ul").eq(0);
            for (var i = 0; i < data.length ; i++) {
                var n = data[i];
                n["tag_id"] = pid + "_" + i;
                var child = n[ops.dataFormat.child];
                n["icon2"] = (child && child.length > 0) || (n[ops.dataFormat.open]) ? "ico" : "docu";
                var html = $this.filltrData(n);
                var d = n;
                var $html = $("<li>"+html+"</li>");
                if (chk&&ops.multiple) {
                    $html.find(".chk").addClass("checkbox_true_full_focus");
                }
                $ul.append($html);
                var $li = $ul.children("li:last"), $chk;
                var $docu=$li.find(".switch").eq(0);
                if (n["icon2"] == "docu" && !$docu.hasClass("docu")) {
                    $docu.addClass("docu");
                }
                $chk = $li.find(".chk").eq(0);
                if ($chk && n[ops.dataFormat.checked]) {
                    $chk.addClass("checkbox_true_full_focus").removeClass("checkbox_false_full");
                }
                $li.data("rowdata", d);
            }
        },
        copyobject: function (data) {
            var obj = {};
            for (var i in data) {
                if(i.toString()!=this.options.dataFormat.child)
                    obj[i]=data[i];
            }
            return obj;
        },//填充
        filltrRootData: function (data) {
            var ops = this.options, $this = this, count = 0;
            if (data) {
                var html = $this.template.fill(data)
                    .replaceo("diyicon", ops.dataFormat.icon != null ? ((data[ops.dataFormat.icon] && data[ops.dataFormat.icon] != "") ? "style=\"background: url(" + data[ops.dataFormat.icon] + ") 0 0 no-repeat;\"" : "") : "")
                    .replaceo("selected", data[ops.dataFormat.selected] ? "fm-sel=\"selected\"" : "")
                    .replaceo("data-id", data.tag_id);
                var cnodeicon = false;
                if (ops.clazz > 0 && ops.expand && ops.clazz <= (count + 1)) {
                    cnodeicon = true;
                }
                return html;
            } else {
                return "";
            }
        },//填充
        filltrData: function (data) {
            var ops = this.options, $this = this, count = 0;
            count = data["tag_id"].toString().split('_').length-1;
            count = count == -1 ? 0 : count;
            if (data) {
                var html = $this.template.fill(data)
                    .replaceo("diyicon", ops.dataFormat.icon != null ? ((data[ops.dataFormat.icon] && data[ops.dataFormat.icon] != "") ? "style=\"background: url(" + data[ops.dataFormat.icon] + ") 0 0 no-repeat;\"" : "") : "")
                    .replaceo("selected", data[ops.dataFormat.selected] ? "fm-sel=\"selected\"" : "")
                    .replaceo("data-id", data.tag_id)
                    .replaceo("layer", "style='padding-left:" + (count * 18) + "px;'");
                var cnodeicon = false;
                if (ops.clazz > 0 && ops.expand && ops.clazz <= (count + 1)) {
                    cnodeicon = true;
                }
                return html;
            } else {
                return "";
            }
        },
        serialize: function (data, pid) {
            var items = new Array(),
                $this = this,
                ops = this.options;
            $.each(data, function (i, d) {
                var child = d[ops.dataFormat.child];
                var n = $this.copyobject(d);
                n["tag_id"] = pid?pid+"_"+i:i;
                items.push(n);
                if (child&&child.length>0) {
                    var temp = $this.serialize(child, n["tag_id"]);
                    $.each(temp, function (j, x) {
                        items.push(x);
                    });
                } 
                n["icon2"] = (child && child.length > 0||!pid) ? "ico" : "docu";
            });
            return items;
        },//展开
        open: function (element) {
            element.children("div.t_close").addClass("t_open").removeClass("t_close");
            var $ul = element.children("ul").show(200);
        },//折叠
        fold: function (element) {
            element.children("div.t_open").addClass("t_close").removeClass("t_open");
            var $ul = element.children("ul").hide(200);
        },//查找
        findParent: function (element) {
            var items = element.prevAll("tr");
            var id = element.attr("id");
            var last = id.lastIndexOf("_");
            id = id.substring(0,last);
            for (var i = 0; i < items.length; i++) {
                if ($(items[i]).attr("id") == id)
                {
                    return $(items[i]);
                }
            }
            return element;
        },//选中
        checkChild: function (element) {
            var $cli = element.children("ul").children("li");
            $cli.each(function (i, n) {
                $(n).find(".chk").addClass("checkbox_true_full_focus").removeClass("checkbox_false_full");
            });
        },//不选
        noCheckChild: function (element) {
            var $cli = element.children("ul").children("li");
            $cli.each(function (i, n) {
                $(n).find(".chk").addClass("checkbox_false_full").removeClass("checkbox_true_full_focus");
            });
        },//选中
        selected: function (element) {
            var data = element.parents("li").data("rowdata");
            var ops = this.options;
            var bfs = true;
            if (ops.beforeSelect) {
                bfs = ops.beforeSelect(data, element);
                if (bfs == undefined) bfs = true;
            }
            if (bfs) {
                if (element.parent("li").hasClass("selected")) {
                    element.parent("li").removeClass("selected");
                } else {
                    if (!this.options.multiple) {
                        this.$element.find("li").removeClass("selected");
                        element.parent("li").addClass("selected");
                    } else {
                        element.parent("li").addClass("selected");
                        this.options.selected(data);
                    }
                }
            }
        },//选中
        checked: function (element) {
            var li = element.parents("li").eq(0);
            var data = element.parents("li").data("rowdata");
            var ops = this.options;
            var bfs = true;
            if (ops.beforeCheck) {
                bfs = ops.beforeCheck(data, element);
                if (bfs == undefined) bfs = true;
            }
            if (bfs) {
                if (!this.options.multiple) {
                    this.$element.find(".checkbox_true_full_focus").addClass("checkbox_false_full")
                    .removeClass("checkbox_true_full_focus");
                }
                if (element.hasClass("checkbox_false_full")) {
                    element.addClass("checkbox_true_full_focus").removeClass("checkbox_false_full");
                    if (!this.options.multiple) {
                        return false;
                    }
                    this.checkChild(li);
                } else {
                    element.addClass("checkbox_false_full").removeClass("checkbox_true_full_focus");
                    this.noCheckChild(li);
                }
            }
        },
        conver: function () {
            var clist = this.$element.find("[fm-conver]");
            $.each(clist, function (i, n) {
                var txt = $(n).html()
                var convfn = $(n).attr("fm-conver");
                var fn = eval(convfn)
                var cvres = fn(txt);
                $(n).html(cvres);
                $(n).removeAttr("fm-conver");
            });
        },//获取选中列表
        getCheckNodes: function () {
            var array = new Array();
            this.$element.find(".checkbox_true_full_focus").each(function (i,n) {
                var tr = $(n).parents("li").eq(0);
                array.push(tr.data("rowdata"));
            });
            return array;
        },//获取选中行列表
        getSelectNodes: function () {
            var array = new Array();
            this.$element.find(".selected").each(function (i, n) {
                array.push($(n).data("rowdata"));
            });
            return array;
        },//设置为选中行
        setSelected: function (element) {
            element.addClass("selected");
        },//设置为选中
        setChecked: function (element) {
            var $chk = $li.find(".chk").eq(0);
            if ($chk && n[ops.dataFormat.checked]) {
                $chk.addClass("checkbox_true_full_focus").removeClass("checkbox_false_full");
            }
        },//填充数据
        setRowData: function (data, element) {
            var isdou,child,ops,paddingnum = 0, padding = element.find(".line").eq(0).css("padding-left");
            if (padding) {
                var v = parseFloat(padding.replace("px", ""));
                if (!isNaN(v))
                    paddingnum += v;
            }
            isdou = element.find("div.cols>.tree>.switch").eq(0).hasClass("docu");
            child = element.find("ul").eq(0);
            ops = this.options;
            var $html = $(this.template.fill(data));
            $html.find(".line").css("padding-left", paddingnum);
            if (isdou) {
                $html.find(".switch").addClass("docu");
            }
            element.data("rowdata", data);
            var httml = ($html.get(0).outerHTML).replaceo("diyicon", ops.dataFormat.icon != null ? ((data[ops.dataFormat.icon] && data[ops.dataFormat.icon] != "") ? "style=\"background: url(" + data[ops.dataFormat.icon] + ") 0 0 no-repeat;\"" : "") : "").replaceo("layer", "");
            element.find(".cols").eq(0).html($(httml).html());
            this.conver();
        },//刷新数据
        reload: function () {
            this.$element.find(".fm-ulgtree").html("");
            this.loadData();
        }
    };
    //函数入口
    $.fn.uGTree = function (options) {
        var $this = $(this);
        var data = $this.data("uGTree");
        if (!data) {
            $this.data("uGTree", (data = new uGTree(this, options)));
        } else {
            data.options = $.extend(false, $this.uGTree.defaults, options);
            data.loadData();
        }
        return data;
    }
    //默认值
    $.fn.uGTree.defaults = {
        url: "",
        data: null,
        expand: -1,//-1全部展开，0，不展开，num展开层数
        dataFormat: { child: "Child", checked:"Checked", selected: "Selected", icon: "Icon", open: "Open" },
        param: null,//附带参数['Id','Pid']
        source: "Data",
        cache:true,
        treeModel: "default",//默认模式
        select:true,
        multiple: false,//是否多项
        selected: function (data) { },
        checked: function (data) { },
        click:function(node,element){},
        afterLoad: null,
        beforeSelect: function (node, element) { },
        beforeCheck: function (node, element) { },
        bindNode:function(node,element){},
        unit:'%',
        header:null
    };
})(window.jQuery);

/*!
 * GridTree表格树控件
 * 创建人：qinnailin
 * 创建时间：2014/7/9 
 */

(function ($) {
    $.fn.GridTree = function (options) {
        var ops = $.extend(true, {
            url: "",
            data: null,
            child: "Child",//子节点名称
            expand: false,
            source: "Data",
            cache:true,
            icon: null,
            treeModel: "default",//默认模式
            multiple: false,//是否多项
            selected: function (data) { },
            clazz: 0,//显示层级默认展开时显示全部
            afterLoad: null
        }, options);
        var objthis = $(this);
        var thisId = $(objthis).attr("id");
        var template;
        if (!document.getElementById(thisId + "_template")) {
            template = findTemp();
            $("body").append("<script type='text/template' id='" + thisId + "_template' >" + template + "</script>");
        } else {
            template = $("#" + thisId + "_template").html();
        }
        var tbodybox = findTempBox();
        tbodybox.html("数据加载中……");
        var nodeicon = ops.expand ? "open" : "close";
        var maxrootnum;
        var fnc = {};

        /**
         * 页面加载完毕
         * @method ready
         * @for GridTreejs
         */
        $(document).ready(function () {
            //tr点击事件
            $(objthis).on("click", "[fm-body]>tr", function () {
                if (ops.treeModel == "checkbox") return;
                if (ops.multiple) {
                    if (ops.treeModel == "checkbox") {
                        if ($(this).hasClass("selected")) {
                            $(this).removeClass("selected");
                            $(this).find(".chk").removeClass("checkbox_true_full_focus").addClass("checkbox_false_full")
                        } else {
                            $(this).find(".chk").removeClass("checkbox_false_full").addClass("checkbox_true_full_focus")
                        }
                    } else {
                        if ($(this).hasClass("selected")) {
                            $(this).removeClass("selected");
                        } else {
                            $(this).addClass("selected");
                        }
                    }
                    findParent($(this));
                    checkChild($(this));
                } else {
                    if (ops.treeModel == "checkbox") {
                        $(objthis).find(".chk").removeClass("checkbox_true_full_focus").addClass("checkbox_false_full")
                        $(this).find(".chk").removeClass("checkbox_false_full").addClass("checkbox_true_full_focus")
                    } else {
                        $(this).addClass("selected").siblings("tr").removeClass("selected")
                    }
                }
                if (ops.selected) {
                    ops.selected(stringToJSON($(this).find("textarea").html()));
                }
            });
            //+号点击事件
            $(objthis).on("click", "span.switch", function () {
                var oth = $(this);
                var cs = $(oth);
                if (cs.attr("class").search("_close") > 0) {
                    var classs = getClass(cs, "close");
                    $(oth).removeClass(classs).addClass(classs.replace("_close", "_open"));
                } else if (cs.attr("class").search("_open") > 0) {
                    var classs = getClass(cs, "open");
                    $(oth).removeClass(classs).addClass(classs.replace("_open", "_close"));
                }
                cs = $(oth).nextAll("span").not(".chk").eq(0);
                if (cs.attr("class").search("_close") > 0) {
                    var classs = getClass(cs, "close");
                    $(cs).removeClass(classs).addClass(classs.replace("_close", "_open"));
                } else if (cs.attr("class").search("_open") > 0) {
                    var classs = getClass(cs, "open");
                    $(cs).removeClass(classs).addClass(classs.replace("_open", "_close"));
                }
                displayObj($(oth).parents("tr"));
                return false;
            });
            //checkbox点击事件
            $(objthis).on("click", "span.chk", function () {
                var oth = $(this);
                var hascheck = false;
                if (!ops.multiple) {
                    if (!$(oth).next("span").hasClass("ico_docu")) {
                        return false;
                    }
                    if ($(oth).hasClass("checkbox_true_full_focus")) {
                        $(oth).removeClass("checkbox_true_full_focus").addClass("checkbox_false_full")
                    } else {
                        $(oth).removeClass("checkbox_false_full").addClass("checkbox_true_full_focus")
                        $(oth).parents("tr").siblings("tr").find(".chk").removeClass("checkbox_true_full_focus").addClass("checkbox_false_full");
                    }
                    $(objthis).find("tr").removeClass("selected");
                } else {
                    if ($(oth).hasClass("checkbox_true_full_focus")) {
                        $(oth).removeClass("checkbox_true_full_focus").addClass("checkbox_false_full")
                    } else {
                        hascheck = true;
                        $(oth).removeClass("checkbox_false_full").addClass("checkbox_true_full_focus")
                    }
                }
                if ($(oth).hasClass("checkbox_true_full_focus")) {
                    $(oth).parents("tr").removeClass("selected");
                } else {
                    if (ops.treeModel != "checkbox")
                        $(oth).parents("tr").addClass("selected");
                }

                if (ops.multiple) {
                    findParent($(oth).parents("tr"));
                    checkChild($(oth).parents("tr"), hascheck);
                }
                if (ops.selected) {
                    ops.selected(stringToJSON($(this).find("textarea").html()));
                }
                return false;
            });
        });

        loaddata();
        /**
         * 数据加载
         * @method loaddata
         * @for GridTreejs
         */
        function loaddata() {
            if (ops.data != null) {
                $(tbodybox).html(fillRootData());
                applyLayer();
                setdisplay();
                setDefault();
                converfunc();
            } else if (ops.url != "") {
                $.getJSON(ops.url, { _r_t: (ops.cache ? 0 : Math.random()) }, function (data) {
                    ops.data = data;
                    if (ops.source != "") {
                        var temp = data;
                        var item = ops.source.split('.');
                        $.each(item, function (i, n) {
                            if (n != "") {
                                temp = temp[n];
                            }
                        });
                        ops.data = temp;
                    }
                    $(tbodybox).html(fillRootData());
                    applyLayer();
                    setdisplay();
                    setDefault();
                    converfunc();
                    if (ops.afterLoad) {
                        ops.afterLoad();
                    }
                });
            }
        }

        /**
        * 渲染层级
        * @method applyLayer
        * @for GridTreejs
        */
        function applyLayer() {
            $(objthis).find("tr[layer]").each(function (i, n) {
                var layer = $(n).attr("layer");
                //$(n).find(".line").css("padding-left",18*parseInt(layer)+"px");
            });
        }

        /**
        * 显示或隐藏子节点
        * @method setdisplay
        * @for GridTreejs
        */
        function setdisplay() {
            $(objthis).find("[data-pid]").each(function (j, d) {
                var pid = $(d).attr("data-pid");
                if (pid == maxrootnum) {
                    //$(d).nextAll("[data-pid]").find(".line").removeClass("line");
                }
                $(d).nextAll("[data-pid]").each(function (i, n) {
                    var pids = $(n).attr("data-pid");
                    if (pids.indexOf(pid) == 0 && pids != pid) {
                        if ($(d).find("span.switch").attr("class").search("_open") > 0) {
                            setShow(n);
                        } else {
                            setHide(n);
                        }
                    }
                });
            });
        }

        /**
        * 显示
        * @method setShow
        * @param {object} obj 节点对象
        * @for GridTreejs
        */
        function setShow(obj) {
            $(obj).removeClass("hide").addClass("show");
        }

        /**
        * 隐藏
        * @method setHide
        * @param {object} obj 节点对象
        * @for GridTreejs
        */
        function setHide(obj) {
            $(obj).removeClass("show").addClass("hide");
        }

        /**
        * 递归寻找现实或隐藏
        * @method displayObj
        * @param {object} obj 节点对象
        * @for GridTreejs
        */
        function displayObj(obj) {
            var pid = $(obj).attr("data-pid");
            $(obj).nextAll("tr").each(function (i, n) {
                var cpid = $(n).attr("data-pid");
                if (cpid.indexOf(pid) == 0 && pid != cpid && cpid.length - 5 == pid.length) {
                    if ($(obj).find("span.switch").attr("class").search("_open") > 0 && !$(obj).hasClass("hide")) {
                        setShow(n);
                    } else {
                        setHide(n);
                    }
                    displayObj(n);
                }
            });
        }

        /**
        * 递归寻找子节点选择或者不选择
        * @method checkChild
        * @param {object} obj 节点对象
        * @for GridTreejs
        */
        function checkChild(obj, hascheck) {
            var pid = $(obj).attr("data-pid");
            $(obj).nextAll("tr").each(function (i, n) {
                var cpid = $(n).attr("data-pid");
                if (cpid.indexOf(pid) == 0 && pid != cpid && cpid.length - 5 == pid.length) {
                    if (hascheck) {
                        $(n).find("span.chk").removeClass("checkbox_false_full").addClass("checkbox_true_full_focus");
                        if (ops.treeModel != "checkbox")
                            $(n).addClass("selected");
                    } else {
                        $(n).find("span.chk").removeClass("checkbox_true_full_focus").addClass("checkbox_false_full");
                        if (ops.treeModel == "checkbox") {
                            $(n).removeClass("selected");
                        }
                    }
                    checkChild(n, hascheck);
                }
            });
        }

        /**
        * 设置默认项
        * @method setDefault
        * @for GridTreejs
        */
        function setDefault() {
            $(objthis).find("[fm-sel]").each(function (i, n) {
                if (ops.treeModel != "checkbox")
                    $(n).parents("tr").addClass("selected");
                $(n).siblings(".chk").addClass("checkbox_true_full_focus");
                if (!$(n).siblings("span").hasClass("ico_docu")) {
                    checkChild($(n).parents("tr"));
                }
            });
        }

        /**
        * 递归寻找父节点
        * @method findParent
        * @param {object} obj 节点对象
        * @for GridTreejs
        */
        function findParent(obj) {
            var cid = $(obj).attr("data-pid");
            $(obj).prevAll("tr").each(function (i, n) {
                var pid = $(n).attr("data-pid");
                if (cid.indexOf(pid) == 0 && pid != cid && cid.length - 5 == pid.length) {//查找父节点
                    if ($(obj).find("span.chk").hasClass("checkbox_false_full")) {
                        $(n).find("span.chk").removeClass("checkbox_true_full_focus").addClass("checkbox_false_full");
                        if (ops.treeModel == "checkbox") {
                            $(n).removeClass("selected");
                        }
                    } else {
                        var needselectparent = true;
                        $(obj).siblings("tr").each(function (i, t) {
                            var tb = $(t).attr("data-pid");
                            if (tb.indexOf(pid) == 0 && cid.indexOf(pid) == 0 && cid.length == tb.length) {//查找同辈节点
                                if (!$(t).find("span.chk").hasClass("checkbox_true_full_focus")) {
                                    needselectparent = false;
                                }
                            }
                        });
                        if (needselectparent) {
                            $(n).find("span.chk").removeClass("checkbox_false_full").addClass("checkbox_true_full_focus");
                        }
                    }
                    findParent(n);
                }
            });
        }

        /**
        * 填充root节点数据
        * @method fillRootData
        * @for GridTreejs
        */
        function fillRootData() {
            var html = "";
            $.each(ops.data, function (i, n) {
                var cnt = "roots_" + nodeicon;
                if (i > 0 && i < ops.data.length - 1) {
                    cnt = "center_" + nodeicon;
                } else if (i > 0) {
                    cnt = "bottom_" + nodeicon;
                }
                html += fillLiData(n, cnt, "ico_" + nodeicon, (i + 1000) + "");
                maxrootnum = i;
            });
            return html;
        }

        /**
        * 填充child节点数据
        * @method fillLiData
        * @param {object} data 控件参数对象
        * @param {string} icon1 图标1
        * @param {string} icon2 图标2
        * @param {string} p 父节点属性
        * @for GridTreejs
        */
        function fillLiData(data, icon1, icon2, p) {
            var count = 0;
            if (p.indexOf("-") > 0) {
                count = p.split("-").length - 1;
            }
            if (data) {
                var html = template.fill(data)
                    .replaceo("icon1", icon1)
                    .replaceo("diyicon", ops.icon != null ? ((data[ops.icon] && data[ops.icon] != "") ? "style=\"background: url(" + data[ops.icon] + ") 0 0 no-repeat;\"" : "") : "")
                    .replaceo("selected", data.Selected ? "fm-sel=\"selected\"" : "")
                    .replaceo("data-pid", p)
                    .replaceo("layer", "style='padding-left:" + (count * 18) + "px;'")
                    .replaceo("dataSouce", stringify(data))
                    .replaceo("icon2", icon2);
                var cnodeicon = false;
                if (ops.clazz > 0 && ops.expand && ops.clazz <= (count + 1)) {
                    cnodeicon = true;
                }
                return html + fillChildData(data[ops.child], p, cnodeicon);
            } else {
                return "";
            }
        }

        /**
        * 填充child节点数据
        * @method fillChildData
        * @param {object} ops 控件参数对象
        * @param {string} p 父节点
        * @for GridTreejs
        */
        function fillChildData(data, p, cnodeicon) {
            if (data && data.length > 0) {
                var html = "";
                $.each(data, function (i, n) {
                    var icon2 = "ico_" + (cnodeicon ? "close" : nodeicon);
                    var icon1 = data.length - 1 == i ? "bottom_" + (cnodeicon ? "close" : nodeicon) : "center_" + (cnodeicon ? "close" : nodeicon);
                    if (!n[ops.child] || n[ops.child].length == 0) {
                        icon2 = "ico_docu";
                        icon1 = data.length - 1 == i ? "bottom_docu" : "center_docu";
                    }
                    html += fillLiData(n, icon1, icon2, p + "-" + (i + 1000));
                });
                return html;
            } else {
                return "";
            }
        }

        /**
         * 转换控制
         * @method converfunc
         * @for GridTreejs
         */
        function converfunc() {
            var clist = $(objthis).find("[fm-conver]");
            $.each(clist, function (i, n) {
                var txt = $(n).html()
                var convfn = $(n).attr("fm-conver");
                var fn = eval(convfn)
                var cvres = fn(txt);
                $(n).html(cvres);
            });
        }

        /**
        * 获取class
        * @method getClass
        * @param {object} classs class列表
        * @param {string} str 过滤后缀
        * @for GridTreejs
        */
        function getClass(node, str) {
            var ccs = node.attr("class").split(' ');
            var res;
            for (var i in ccs) {
                if (str == "close") {
                    res = ccs[i].match(/(.+?_close)/g);
                } else {
                    res = ccs[i].match(/(.+?_open)/g);
                }
                if (res) {
                    break;
                }
            }
            return res + "";
        }

        /**
        * 查找模版
        * @method findTemp
        * @for GridTreejs
        */
        function findTemp() {
            var iconTemp = "<span {{selected}} class=\"line\" {{layer}} ></span><span class=\"button switch {{icon1}}\"></span>"
            if (ops.treeModel == "checkbox") {
                iconTemp += "<span  class=\"button chk checkbox_false_full\" ></span>";
            }
            iconTemp += "<span {{diyicon}} class=\"button {{icon2}}\"></span><textarea style=\"display:none;\" >{{dataSouce}}</textarea>";
            var first;
            if ($(objthis).find("[fm-body]").find("[fm-tree]").is("td")) {
                first = $(objthis).find("[fm-body]").find("td[fm-tree]").eq(0);
            } else {
                first = $(objthis).find("[fm-body]").find("td").eq(0);
            }
            $(first).html(iconTemp + $(first).html())
            $(objthis).find("[fm-body]").children("tr").attr("data-pid", "{{data-pid}}")
            var temphtml = $(objthis).find("[fm-body]").html();
            return temphtml;
        }

        /**
        * 查找模板外壳
        * @method findTempBox
        * @for GridTreejs
        */
        function findTempBox() {
            return $(objthis).find("[fm-body]").addClass("fm-gtree");
        }

        /**
        * 方法组
        * @for GridTreejs
        */
        var fnc = {
            //获取选中内容
            getSelected: function () {
                var seldata = new Array();
                if (ops.treeModel == "checkbox") {
                    $(objthis).find(".checkbox_true_full_focus").each(function (i, n) {
                        seldata.push(stringToJSON($(n).nextAll("textarea").html()));
                    });
                } else {
                    $(objthis).find(".selected").each(function (i, n) {
                        seldata.push(stringToJSON($(n).find("textarea").html()));
                    });
                }
                return seldata;
            },
            //重新加载
            reload: function () {
                if (ops.url != "") {
                    ops.data = null;
                }
                loaddata();
            },
            //刷新
            refresh: function () {
                loaddata();
            },
            getData: function () {
                return ops.data;
            },
            load: function (opst) {
                if (opst instanceof Object) {
                    ops.data = opst;
                } else {
                    ops.data = null;
                    ops.url = opst;
                }
                loaddata();
            }
        }
        return fnc;
    }
})(jQuery);
(function ($) {
    $.fn.leftMenu = function (opstions) {
        var ops = $.extend(true, {
            url: "",
            data: null,
            model: "mini",
            box:"li"//div
        }, opstions);
    }
})(jQuery);/*!
 * jqueryui 模态窗口拓展类
 *创建人：qinnailin
 * 创建时间：2014/7/20 
 *
 *
 * 
 */

var basic_modal_content_count = 0;
(function ($) {
    $.fn.modal = function (options) {
        var ops = $.extend(true, {
            title: "",
            url: null,
            modal: true,
            resizable: false,
            width: "auto",
            timeout: null,
            beforeClose: function () {
                if (ops.modal == undefined || ops.modal) {
                    if (!isparent) {
                        if ($(".ui-widget-overlay").size() < 2) {
                            crossdomain("closebgmodel", "");
                        }
                    }
                }
            },
            afterCreate: null,
            closeText: ""
        }, options);
        var objthis = $(this);
        var html = $(objthis).html();
        if (ops.url) {
            $.get(ops.url, function (hdata) {
                html = hdata;
                showmodal();
            });
        } else {
            showmodal();
        }
        function showmodal() {

            if ($(objthis).is("script")) {
                var mun = $(objthis).attr("data-mun");
                if (!mun) {
                    mun = ++basic_modal_content_count;
                    $("body").append("<div id='basic-modal-content-" + mun + "' class='basic-modal-content' style='display:none;overflow: visible;'></div>")
                    $(objthis).attr("data-mun", mun);
                } else {
                    if (!document.getElementById("basic-modal-content-" + mun)) {
                        $("body").append("<div id='basic-modal-content-" + mun + "' class='basic-modal-content' style='display:none;overflow: visible;'></div>")
                    }
                }
                objthis = $("#basic-modal-content-" + mun);
            }
            $(objthis).html(html);
            try {
                $(objthis).dialog(ops);
            } catch (e) {
                alert("请引入jqueryui插件");
            }

            $(objthis).dialog({
                close: function (event, ui) {
                    $(objthis).dialog("destroy");
                    if ($(objthis).hasClass("basic-modal-content"))
                        $(objthis).html("");
                    if (ops.close) {
                        ops.close();
                    }
                }
            });

            if (ops.modal) {
                if (!isparent) {
                    crossdomain("showbgmodel", "");
                }
            }
            if (ops.timeout) {
                setTimeout("closemodel(" + num + ")", ops.timeout);
            }
            if (ops.afterCreate) {
                ops.afterCreate();
            }
            $(objthis).find(".layout-center").each(function (i, n) {
                findlayout($(n));
            });
        }
    }
    /**
	* 模态窗口关闭
	* @method close
	* @for modeljs
	*/
    $.fn.close = function () {
        if ($(this).is("script")) {
            var mun = $(this).attr("data-mun");
            if (!mun) {
                $(this).dialog("close");
                $(this).html("");
            } else {
                closemodel(mun);
            }
        } else {
            $(this).dialog("close");
        }
    }
})(jQuery);

/**
* 模态窗口关闭
* @method closemodel
* @param {int} num 模态窗口序号
* @for modeljs
*/
closemodel = function (num) {
    $("#basic-modal-content-" + num).dialog("close");
    $("#basic-modal-content-" + num).html("");
}

/**
* alert 拓展
* @method alertui
* @param {string} html 内容
* @for modeljs
*/
function alertui(html) {
    if (!document.getElementById("message-basic-modal-content")) {
        $("body").append("<div id='message-basic-modal-content' style='display:none;overflow: visible;'></div>")
    }
    var showmodal = true;
    if ($(".ui-widget-overlay").get(0)) {
        showmodal = false;
    }
    var ops = $.extend(true, {
        modal: showmodal,
        resizable: false,
        width: "250",
        clear: true,
        title:"提示!",
        beforeClose: function () {
            $("#message-basic-modal-content").html("").hide();
            if (!isparent) {
                if (showmodal) {
                    crossdomain("closebgmodel", "");
                }
            }
        },
        buttons: [
                    {
                        text: "确定",
                        click: function () {
                            $("#message-basic-modal-content").dialog("close")
                            if (!isparent) {
                                if (showmodal) {
                                    crossdomain("closebgmodel", "");
                                }
                            }
                        }
                    }
        ]
    }, {});
    if (!isparent && showmodal) {
        crossdomain("showbgmodel", "");
    }
    $("#message-basic-modal-content").html("<div>"+html+"</div>");
    $("#message-basic-modal-content").dialog(ops);
    return false;
}


/**
* confirm拓展
* @method confirmui
* @param {string} html 内容
* @param {function} func 方法
* @for modeljs
*/
function confirmui(html, func,fune) {
    if (!document.getElementById("message-basic-modal-content")) {
        $("body").append("<div id='message-basic-modal-content' style='display:none;overflow: visible;'></div>")
    }
    var showmodal = true;
    if ($(".ui-widget-overlay").get(0)) {
        showmodal = false;
    }
    var ops = $.extend(true, {
        modal: showmodal,
        resizable: false,
        width: "350",        
        clear: true,
        title:"提示!",
        beforeClose: function () {
            $("#message-basic-modal-content").html("").hide();
            if (!isparent) {
                if (showmodal) {
                    crossdomain("closebgmodel", "");
                }
            }
        },
        buttons: [
                    {
                        text: "确定",
                        click: function () {
                            func();
                            $("#message-basic-modal-content").dialog("close")
                            if (!isparent) {
                                if (showmodal) {
                                    crossdomain("closebgmodel", "");
                                }
                            }
                        }
                    },
                    {
                        text: "取消",
                        click: function () {
                            $("#message-basic-modal-content").dialog("close")
                            if (!isparent) {
                                if (showmodal) {
                                    crossdomain("closebgmodel", "");
                                }
                            }
                            if (fune) {
                                fune();
                            }
                        }
                    }
        ]
    }, {});
    if (!isparent && showmodal) {
        crossdomain("showbgmodel", "");
    }
    $("#message-basic-modal-content").html(html);
    $("#message-basic-modal-content").dialog(ops);
    return false;
}

/**
* 显示loading
* @method loading
* @param {bool} statu : true-显示  false-隐藏
* @for modeljs
*/
loading = function (statu) {
    if (isparent) {
        if (statu == true) {
            var temp = '<div class="alert fade in loading"><span></span>数据加载中……</div>'
            showmsghtml(temp);
        } else {
            ClosemsgModal();
        }
    } else {
        crossdomain("loading", statu);
    }
}

/**
* 显示loading
* @method loading
* @param {bool} statu : true-显示  false-隐藏
* @for modeljs
*/
meddleloading = function (statu, msg) {
    if ($("#show-middle-modal-content").get(0) && statu) {
        $("#show-middle-modal-content-msg").html(msg);
    } else {
        if (isparent) {
            if (statu == true) {
                var temp = '<div class="meddileloading" ><div></div><span id="show-middle-modal-content-msg" >' + (msg ? msg : "数据加载中……") + '</span></div>'
                showMiddleModalHtml(temp);
            } else {
                closeMiddleModal();
            }
        } else {
            crossdomain("meddleloading", statu);
        }
    }
}

/**
* 显示错误信息
* @method errormsg
* @param {string} msg 提示消息
* @for modeljs
*/
errormsg = function (msg) {
    if (isparent) {
        var temp = '<div class="alert alert-error"><strong>提示！</strong>{{msg}}</div>';
        showmsghtml(temp.replaceo("msg", "<b style='color:red;'>" + msg + "</b>"));
        setTimeout("ClosemsgModal()", 2500);
    } else {
        crossdomain("errormsg", msg);
    }
}

/**
* 显示正常信息
* @method infomsg
* @param {string} msg 提示消息
* @for modeljs
*/
infomsg = function (msg) {
    if (isparent) {
        var temp = '<div class="alert alert-info"><strong>提示！</strong>{{msg}}</div>';
        showmsghtml(temp.replaceo("msg", msg));
        setTimeout("ClosemsgModal()", 2000);
    } else {
        crossdomain("infomsg", msg);
    }
}

function ClosemsgModal() {
    $("#msgshow-modal-content").html("");
    $("#msgshow-modal-content").hide();
}

/**
* 显示提示信息
* @method showmsghtml
* @param {string} html 内容
* @for modeljs
*/
function showmsghtml(html) {
    if (!document.getElementById("msgshow-modal-content")) {
        $("body").append("<div id='msgshow-modal-content' style='width:200px;' ></div>");
    }
    if (!document.getElementById("styleshowmsghtml")) {
        $("#styleshowmodal").remove();
        $("body").append("<style id='styleshowmsghtml' >#msgshow-modal-content{z-index: 9999;height:35px;display:none;}</style>");
    }
    $("#msgshow-modal-content").html(html);
    var windowWidth = document.documentElement.clientWidth;
    var windowHeight = document.documentElement.clientHeight;
    //var popupHeight = $("#msgshow-modal-content").height();
    //var popupWidth = $("#msgshow-modal-content").width();
    var top = $(document).scrollTop();
    $("#msgshow-modal-content").css({
        "position": "absolute",
        "top": top,
        "left": (windowWidth - 100) / 2
    }).animate({ top: top + 5 }, 500);
    $("#msgshow-modal-content").show();
}

//无标题弹出框
function showMiddleModalHtml(html) {
    if (!document.getElementById("show-middle-modal-content")) {
        $("body").append("<div id='show-middle-modal-content' ></div>");
    }
    if (!document.getElementById("show-middle-modal-content-bg")) {
        $("body").append("<div id='show-middle-modal-content-bg' ></div>");
    }
    if (!document.getElementById("styleshowMiddlehtml")) {
        $("#styleshowMiddlehtml").remove();
        $("head").append("<style id='styleshowMiddlehtml' >#show-middle-modal-content{position:absolute;z-index: 9999;height:35px;display:none;}#show-middle-modal-content-bg{z-index: 9998;display:none;position: fixed;top: 0;left: 0;width: 100%;height: 100%;background: #666666  50% 50% repeat;opacity: .5;filter: Alpha(Opacity=50);}</style>");
    }
    $("#show-middle-modal-content").html(html);
    $("#show-middle-modal-content").show();
    $("#show-middle-modal-content-bg").show();
    var popupHeight = $("#show-middle-modal-content").height();
    var popupWidth = $("#show-middle-modal-content").children().width();
    var windowWidth = document.documentElement.clientWidth;
    var windowHeight = document.documentElement.clientHeight;
    var top = $(document).scrollTop();
    $("#show-middle-modal-content").css({
        "top": ((windowHeight - popupHeight) / 2) + top,
        "left": (windowWidth - popupWidth) / 2
    });
}

//关闭无标题模态窗口
function closeMiddleModal() {
    $("#show-middle-modal-content").html("").hide();
    $("#show-middle-modal-content-bg").hide();
}/*!
 * selectbox控件
 * 创建人：qinnailin
 * 创建时间：2014/11/13 
 *
 *
 * 
 */
!(function ($) {
    "use strict"
    var selectbox = function (element, options) {
        this.init("selectbox", element, options);
    }
    var isin = 0;

    selectbox.prototype = {
        constructor:selectbox,
        init: function (type, element, options) {
            this.type = type;
            this.$element = $(element);
            this.options = this.getOptions(options);
            if (!$(element).hasClass("fmSelectbox")) {
                $(element).addClass("fmSelectbox");
            }
            var width = $(element).width();
            var height = $(element).height();
            var objname = $(element).attr("fm-name");
            var empty = false;
            var selthis;
            var $this = this;
            if (!$(element).children("select").get(0)) {
                $(element).append("<select style='display:none;' name='" + objname + "' ></select>");
                empty = true;
                selthis = $(element).children("select");
                //if (this.options.defaults) {
                //    $(selthis).append("<option value='" + this.options.defaults[1] + "' >" + this.options.defaults[0] + "</option>");
                //}
            } else {
                selthis = $(element).children("select");
                if (!$(selthis).attr("name")) {
                    $(selthis).attr("name", $(element).attr("fm-name"));
                }
                $(selthis).hide();
            }
            this.selthis = selthis;
            //兼容旧的使用习惯
            if ($(element).children("ul").get(0)) {
                $(selthis).empty();
                $(element).find("ul>li").each(function (i, n) {
                    var val = $(this).attr("val");
                    var test = $(this).text();
                    $(selthis).append("<option value='" + val + "' >" + test + "</option>");
                });
                $(element).children("ul").remove();
            }
            //兼容旧的使用习惯
            this.defaultval = this.options.defaults ? this.options.defaults[1] : $(selthis).val();
            this.defaulttext = this.options.defaults ? this.options.defaults[0] : $(selthis).children("option[value='" + this.defaultval + "']").text();
            $(element).append("<span style='height:" + height + "px;' >" + this.defaulttext + "<em></em></span>");
            var spanthis = $(element).children("span");
            this.spanthis = spanthis;
            $(element).append("<div style='width:" + (width - 2) + "px;display:none;'><ul class='ul_sel'></ul></div>");
            var showbox = $(element).children("div");
            if (empty) {
                if (this.options.url == "" && this.options.data != null) {
                    this.loadData();
                } else if (this.options.url != "") {
                    var ops = this.options;
                    $.getJSON(ops.url, function (rd) {
                        var data;
                        if (ops.source == "") {
                            data = rd;
                        } else {
                            var temp = rd;
                            var item = ops.source.split('.');
                            $.each(item, function (i, n) {
                                if (n != "") {
                                    temp = temp[n];
                                }
                            });
                            data = temp;
                        }
                        $this.setData(data);
                        $this.loadData();
                    });
                }
            }
            $(spanthis).click(function (e) {
                if ($(element).hasClass("disabled")) {
                    return false;
                }
                if ($(showbox).find("li").length > 0) {
                    $this.hideshowbox();
                    e.stopPropagation();
                } else {
                    $this.showlist();
                    e.stopPropagation();
                }
            });
            
            $(element).on("click", "div>ul>li", function () {
                var val = $(this).attr("val");
                var text = $(this).text();
                $this.setvalue(val, text);
                $this.hideshowbox();
                if ($this.options.change) {
                    $this.options.change($(selthis).val());
                }
            });

            //body点击事件
            $(document).click(function () {
                if (isin <= 0) {
                    $this.hideshowbox();
                }
            });
            //鼠标进进出出
            $(element).hover(function () {
                isin++;
            }, function () {
                isin--;
            });
        },
        reqdata: function () {
            var $this = this;
            var ops = this.options;
            $.getJSON(ops.url, function (rd) {
                var data;
                if (ops.source == "") {
                    data = rd;
                } else {
                    var temp = rd;
                    var item = ops.source.split('.');
                    $.each(item, function (i, n) {
                        if (n != "") {
                            temp = temp[n];
                        }
                    });
                    data = temp;
                }
                $this.setData(data);
                $this.loadData();
            });
        },
        getOptions: function (options) {
            return $.extend({}, $.fn[this.type].defaults, options, this.$element.data());
        },//加载数据
        loadData: function () {
            var ops = this.options;
            if (ops == undefined) return false;
            var $selthis = this.selthis;
            if (this.options.defaults) {
                $selthis.append("<option value='" + this.options.defaults[1] + "' >" + this.options.defaults[0] + "</option>");
            }
            $.each(ops.data, function (i, n) {
                $selthis.append("<option value='" + n[ops.param.key] + "'>" + n[ops.param.text] + "</option>");
            });
            if (this.defaultval != $(this.selthis).val()) {
                this.defaultval = $(this.selthis).val();
                this.defaulttext = $(this.selthis).children("option[value='" + this.defaultval + "']").text();
                this.spanthis.text(this.defaulttext).append("<em></em>");
            }

            if (this.options.initval) {
                var text = $(this.selthis).children("option[value='" + this.options.initval + "']").text();
                this.setvalue(this.options.initval, text);
            }
            if (this.options.afterLoad) {
                this.options.afterLoad();
            }
        },//设值
        setvalue: function (val, text) {
            $(this.selthis).children("option").siblings().removeAttr("selected");
            $(this.selthis).children("option[value=" + val + "]").attr("selected", "true");
            $(this.spanthis).text(text).append("<em></em>");
        },//列表
        showlist: function () {
            var showbox = this.$element.children("div");
            $(".fmSelectbox>div").hide();
            $(showbox).children("ul").html("");
            $(this.selthis).children("option").each(function (i, n) {
                if ($(n).val() != $(this.selthis).val()) {
                    $(showbox).children("ul").append("<li val='" + $(n).val() + "' >" + $(n).text() + "</li>");
                }
            });
            var liheight = parseFloat($(showbox).find("ul>li").eq(0).height());
            if (this.options.height > 0) {
                if ($(showbox).find("ul>li").size() * liheight > this.options.height) {
                    $(showbox).height(this.options.height);
                    $(showbox).css("overflow-y", "scroll");
                }
            } else {
                if ($(showbox).find("ul>li").size() <= 10) {
                    $(showbox).height($(showbox).find("ul>li").size() * liheight);
                    $(showbox).css("overflow-y", "hidden");
                } else {
                    $(showbox).height(10 * liheight);
                    $(showbox).css("overflow-y", "scroll");
                }
            }
            if ($(showbox).find("ul>li").size() > 0) {
                $(showbox).show();
            }
        },//设置
        setData:function(data){
            this.options.data = data;
        },//隐藏
        hideshowbox: function () {
            var showbox = this.$element.children("div");
            $(showbox).hide();
            $(showbox).children("ul").empty();
            isin = 0;
        },//获取值
        getVal: function () {
            return this.selthis.val();
        },//获取文本
        getText: function () {
            return this.spanthis.text();
        },//选中
        setSelected: function (key) {
            var text = this.selthis.children("option[value='" + key + "']").text();
            this.setvalue(key, text);
        },//清除
        clear: function () {
            var showbox = this.$element.children("div");
            $(showbox).children("ul").html("");
            this.selthis.html("");
            this.spanthis.text("").append("<em></em>");
            this.defaultval = "";
        },//重置
        reload: function (obj) {
            this.clear();
            if (obj instanceof Object) {
                this.options.data = obj;
                this.loadData();
                var val = this.selthis.val();
                if (this.options.change) {
                    this.options.change(val);
                }
            } else {
                var ops = this.options;
                var $this = this;
                $.getJSON(obj, function (rd) {
                    var data;
                    if (ops.source == "") {
                        data = rd;
                    } else {
                        var temp = rd;
                        var item = ops.source.split('.');
                        $.each(item, function (i, n) {
                            if (n != "") {
                                temp = temp[n];
                            }
                        });
                        data = temp;
                    }
                    $this.setData(data);
                    $this.loadData();
                    var val = $this.selthis.val();
                    if (ops.change) {
                        ops.change(val);
                    }
                });
            }
        }
    }
    //插件入口
    $.fn.selectbox = function (options) {
        var $this = $(this);
        var data = $this.data("selectbox");
        if (!data) {
            $this.data("selectbox", (data = new selectbox(this, options)));
        } else {
            data.options = $.extend(false, $this.selectbox.defaults, options);
            data.clear();
            if (data.options.data != null) {
                data.loadData();
            } else {
                data.reqdata();
            }
        }
        return data;
    }
    //初始值
    $.fn.selectbox.defaults = {
        url: "",
        data: null,
        source: "",
        defaults: ["--请选择--", -1],
        param: { key: "id", text: "name" },
        height:0,
        change: null,
        initval: null,
        afterLoad: null
    }

})(window.jQuery);/*!
 * splitter
 * 创建人：qinnailin
 * 创建时间：2015/1/21
 */

!(function ($) {
    "use strict"

    var splitter = function () {
        this.init();
    };
    var canmove = false, $moveobj, isL = true;
    splitter.prototype = {
        constructor: splitter,
        //初始化
        init: function () {
            var $this = this;
            $(".splitter").each(function (i, n) {
                $this.splitter(n);
            });
            $(".splitter").on("mousedown", ".layout-splitter", function (e) {
                $moveobj = $(this);
                canmove = true;
                if ($(this).width() > 4) {
                    isL = false;
                } else {
                    isL = true;
                }
                document.onselectstart = new Function("event.returnValue=false");
            });

            $(document).mouseup(function (e) {
                canmove = false;
                $moveobj = null;
                document.onselectstart = new Function("event.returnValue=true");
            });

            $(document).mousemove(function (e) {
                if (canmove && isL) {
                    var mpos = $this.mouseCoords(e);
                    $this.checkWidth($moveobj, mpos);
                } else if (canmove) {
                    var mpos = $this.mouseCoords(e);
                    $this.checkHeight($moveobj, mpos);
                }
            });
        },//主体
        splitter: function (element) {
            var $element = $(element),
                    w = $element.width() - getwborder($element),
                    h = $element.height()- getontborder($element),
                    left = $element.children(".layout-left"),
                    right = $element.children(".layout-right"),
                    top = $element.children(".layout-up"),
                    down = $element.children(".layout-down"),
                    dlw = left.width(),
                    duh = top.height(),
                    ddh=down.height(),
                    l = dlw > 0 ? dlw : w * 0.2,
                    r = dlw > 0 ? (w - l - 4) : w * 0.8 - 4,
                    u =(duh>0||ddh>0)?(duh>0?duh:(h-ddh-4)): h * 0.5 - 2,
                    d = (duh > 0 || ddh > 0) ? (ddh > 5 ? ddh : (h - u - 4)) : h * 0.5 - 2,
                    $splitter = $("<div></div>");
            d = h > u + d + 4 ? h - u - 4 : d;
            $splitter.addClass("layout-splitter");
            if (left.get(0) && right.get(0)) {
                $splitter.css("width", "4px").css("cursor", "col-resize").css("height", "100%").css("float", "left");
                $splitter.addClass("splitter-L");
                left.after($splitter);
                left.css("width", l).css("height", "100%").css("float", "left");
                right.css("width", r).css("height", "100%").css("float", "left");
            } else if (top.get(0) && down.get(0)) {
                $splitter.css("width", "100%").css("cursor", "row-resize").css("height", "4px");
                $splitter.addClass("splitter-H");
                top.after($splitter);
                top.css("height", u);
                down.css("height", d);
            }
        },//判断宽度
        checkWidth: function (element, pos) {
            var $parent = element.parent(".splitter"),
                    w = $parent.width() - getwborder($parent),
                    left = $parent.children(".layout-left"),
                    right = $parent.children(".layout-right"),
                    lx = this.getPosition(left).left,
                    x = pos.x - lx,
                    x = x < 50 ? 50 : x,
                    l = x - 4,
                    l = l > w - 50 ? w - 50 : l,
                    r = w - l - 4;
            left.width(l);
            right.width(r);
        },//技术坐标
        checkHeight: function (element, pos) {
            var $parent = element.parent(".splitter"),
                    h = $parent.height(),
                    up = $parent.children(".layout-up"),
                    down = $parent.children(".layout-down"),
                    ly = this.getPosition(up).top,
                    y = pos.y - ly,
                    y = y < 5 ? 5 : y,
                    l = y - 4,
                    l = l > h - 5 ? h - 5 : l,
                    r = h - l - 4;
            up.height(l);
            down.height(r);
        },//对象坐标
        getPosition: function (element) {
            return $.extend({}, element.offset(), {
                width: element[0].offsetWidth,
                height: element[0].offsetHeight
            });
        },//坐标
        mouseCoords: function (ev) {
            if (ev.pageX || ev.pageY) {
                return { x: ev.pageX, y: ev.pageY };
            }
            return {
                x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
                y: ev.clientY + document.body.scrollTop - document.body.clientTop
            };
        }
    };
    //自启动
    $(document).ready(function () {
        var obj = new splitter();
    });
})(jQuery);/*!
 * utab 
 * 创建人：qinnailin
 * 创建时间：2014/11/18
 *
 *
 * 
 */
(function ($) {
    $.fn.utab = function (opstions) {
        var ops = $.extend(true, {
        }, opstions);
        var objthis = $(this);
        $(document).ready(function () {
            $(objthis).find(".tab-content>div:first").addClass("tab-pane").addClass("active").siblings("div").addClass("tab-pane");
            $("<ul class=\"nav nav-tabs\"></ul>").insertBefore($(objthis).find(".tab-content"));
            $(objthis).find(".tab-pane").each(function (i, n) {
                var tag = "tab-div-box-fm-"+i;
                $(n).attr("data-tag", tag);
                var name = $(n).attr("data-name");
                $(objthis).find("ul.nav-tabs").append("<li><a href='javascript:' data-tag='" + tag + "' >" + name + "</a></li>");
            });
            $(objthis).find("ul>li:first").addClass("active");
            $(objthis).find("ul.nav-tabs").on("click", "li>a", function () {
                var index = $(objthis).find("ul.nav-tabs>li").index($(this).parent("li"));
                $(this).parent("li").addClass("active").siblings("li").removeClass("active");
                $(objthis).find(".tab-content>div").eq(index).addClass("active").siblings("div").removeClass("active");
            });
        });
    }
})(jQuery);/*!
 * Tooltip 仿bootstrap-tooltip
 * 创建人：qinnailin
 * 创建时间：2014/11/18
 *
 *
 * 
 */


!(function ($) {
    "use strict"
    //Tooltip对象
    var Tooltip = function (element, options) {
        this.init("Tooltip", element, options);
    }
    //Tooltip属性
    Tooltip.prototype = {
        constructor: Tooltip,
        init: function (type,element,options) {
            this.type = type;
            this.$element = $(element);
            this.options = this.getOptions(options);
            this.setContent();
            var eventIn = this.options.trigger == 'hover' ? 'mouseenter' : 'focus'
            var eventOut = this.options.trigger == 'hover' ? 'mouseleave' : 'blur'
            this.$element.on(eventIn, $.proxy(this.enter, this));
            this.$element.on(eventOut, $.proxy(this.leave, this));

        },
        enter: function (e) {
            var self = $(e.currentTarget)[this.type](this.options).data(this.type);
            self.show();
        },
        leave:function(e){
            var self = $(e.currentTarget)[this.type](this.options).data(this.type);
            self.hide();
        },
        getOptions:function(options){
            options = $.extend({}, $.fn[this.type].defaults, options, this.$element.data());
            return options;
        },
        show: function () {
            var $tip, pos, tp, placement = this.options.placement, actualWidth, actualHeight;
            $tip = this.tip();
            $tip.remove().css({ top: 0, left: 0, display: 'block' }).appendTo(document.body);
            var title = this.getTitle();
            if (title == "") return false;
            $tip.find(".tooltip-inner").html(title);
            pos = this.getPosition();
            actualWidth = $tip[0].offsetWidth;
            actualHeight = $tip[0].offsetHeight;
            switch (placement) {
                case "top":
                    tp = { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth/2 };
                    break;
                case "left":
                    tp = { top: pos.top - actualHeight/2+pos.height/2, left: pos.left - actualWidth};
                    break;
                case "right":
                    tp = { top: pos.top -actualHeight / 2 + pos.height / 2, left: pos.left + pos.width   };
                    break;
                case "bottom":
                    tp = { top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2 };
                    break;
                default:
            }
            $tip.addClass("fade").addClass(placement).addClass("in").css(tp);
        },
        hide: function () {
            $(".tooltip").remove();
        },
        getPosition: function () {
            return $.extend({}, this.$element.offset(), {
                width: this.$element[0].offsetWidth,
                height: this.$element[0].offsetHeight
            });
        },
        setContent: function () {
            var $e = this.$element;
            $e.attr("data-title", $e.attr("title")).removeAttr("title");
        },
        tip: function () {
            return $(this.options.template);
        },
        getTitle: function () {
            var $e = this.$element;
            return $e.attr("data-title");
        }
    };
    //入口
    $.fn.Tooltip = function (options) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data("Tooltip");
            if (!data) $this.data("Tooltip", (data = new Tooltip(this, options)));
            //if (typeof options == 'string') data[options];
            if (typeof options == 'string' && options!="") {
                data.options.placement = options;
            }
        });
    }
    //默认值
    $.fn.Tooltip.defaults = {
        placement: 'top',
        trigger:'hover',
        template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
    }
})(window.jQuery);/*!
 * 树控件
 * 创建人：qinnailin
 * 创建时间：2014/7/9 
 */

(function ($) {
    $.fn.Tree = function (options) {
        var ops = $.extend(true, {
            url: null,//异步数据
            data: null,//本地数据数据
            treeModel: "default",//默认模式
            multiple: false,//是否多项
            key: "Id",//隐藏id
            text: "Name",//显示内容
            child: "Child",//子节点名称
            expand: false,
            clazz: 0,
            source: "",
            onlyleaf: false,
            selected: function (data) { },//选中节点事件 multiple==true 时该事件不触发 请使用getSelected()
            afterLoad: null
        }, options);
        var objthis = $(this);
        var nodeicon = ops.expand ? "open" : "close";
        var selData;

        var counter = 0;

        var node_li = "<li {{selected}} ><span class=\"button switch {{icon1}}\" ></span>"
        if (ops.treeModel == "checkbox") {
            node_li += "<span  class=\"button chk checkbox_false_full\" ></span>"
        }
        node_li += "<a  data-id=\"{{" + ops.key + "}}\" ><span {{diyicon}} class=\"button {{icon2}}\"></span><span >{{" + ops.text + "}}</span></a>{{child}}</li>"

        if (ops.url == null && ops.data != null) {
            $(objthis).html(fillRootData());
            setdisplay();
            setSelected();
            if (ops.afterLoad) {
                ops.afterLoad();
            }
        } else {
            loadData();
        }

        /**
         * 页面加载完毕
         * @for Treejs
         */
        $(document).ready(function () {
            if (ops.treeModel == "default") {
                $(objthis).on("click", "a", function () {
                    var oth = $(this);
                    var id = $(oth).attr("data-id");
                    var isnode = $(oth).find(".ico_docu").get(0);
                    if (ops.onlyleaf && isnode == undefined) {
                        return false;
                    }
                    if (!ops.multiple) {
                        $(objthis).find("a").removeClass("curSelectedNode");
                    }
                    if ($(oth).hasClass("curSelectedNode")) {
                        $(oth).removeClass("curSelectedNode");
                    } else {
                        $(oth).addClass("curSelectedNode");
                    }
                    var pid = $(oth).parent("li").parent("ul").prev("a").attr("data-id");
                    if (id) {
                        selData = { key: id, pid: pid ? pid : 0 };
                        ops.selected(selData);
                    }
                });
            }

            $(objthis).on("click", "span.switch", function () {
                var oth = $(this);
                var cs = $(oth);
                if (cs.attr("class").search("_close") > 0) {
                    var classs = getClass(cs, "close");
                    $(oth).removeClass(classs).addClass(classs.replace("_close", "_open"));
                } else if (cs.attr("class").search("_open") > 0) {
                    var classs = getClass(cs, "open");
                    $(oth).removeClass(classs).addClass(classs.replace("_open", "_close"));
                }
                cs = $(oth).siblings("a").children("span");

                if (cs.attr("class").search("_close") > 0) {
                    var classs = getClass(cs, "close");
                    $(oth).siblings("a").children("span").removeClass(classs).addClass(classs.replace("_close", "_open"));
                } else if (cs.attr("class").search("_open") > 0) {
                    var classs = getClass(cs, "open");
                    $(oth).siblings("a").children("span").removeClass(classs).addClass(classs.replace("_open", "_close"));
                }
                $(oth).parent("li").find("ul").each(function (i, n) {
                    if ($(this).prevAll("span.switch").attr("class").search("_open") > 0) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            });
            $(objthis).on("click", "span.chk", function () {
                var oth = $(this)
                var isnode = $(oth).siblings("ul").get(0);
                if (isnode && !ops.multiple) {
                    return;
                }
                if (!ops.multiple) {
                    if ($(oth).hasClass("checkbox_true_full_focus")) {
                        $(objthis).find(".chk").removeClass("checkbox_true_full_focus").addClass("checkbox_false_full");
                    } else {
                        $(objthis).find(".chk").removeClass("checkbox_true_full_focus").addClass("checkbox_false_full");
                        $(oth).removeClass("checkbox_false_full").addClass("checkbox_true_full_focus");
                        var id = $(oth).next("a").attr("data-id");
                        var pid = $(oth).parent("li").parent("ul").prev("a").attr("data-id");
                        if (id) {
                            selData = { key: id, pid: pid ? pid : 0 };
                            ops.selected(selData);
                        }
                    }
                } else {
                    if ($(oth).hasClass("checkbox_false_full")) {
                        $(oth).removeClass("checkbox_false_full").addClass("checkbox_true_full_focus");
                        $(oth).siblings("ul").find(".chk").removeClass("checkbox_false_full").addClass("checkbox_true_full_focus");
                        var id = $(oth).next("a").attr("data-id");
                        var pid = $(oth).parent("li").parent("ul").prev("a").attr("data-id");
                        if (id) {
                            selData = { key: id, pid: pid ? pid : 0 };
                            ops.selected(selData);
                        }
                    } else {
                        $(oth).removeClass("checkbox_true_full_focus").addClass("checkbox_false_full");
                        var parent = $(oth).parent("li").parent("ul");
                        var childsize = $(parent).find(".checkbox_true_full_focus").size();
                        $(oth).parent("li").parents("ul").siblings(".chk").removeClass("checkbox_true_full_focus").addClass("checkbox_false_full");
                        var childent = $(oth).siblings("ul").find(".chk").removeClass("checkbox_true_full_focus").addClass("checkbox_false_full");
                    }
                    selectParent($(oth));
                }


            });
        });

        /**
         * 数据加载
         * @method loadData
         * @for Treejs
         */
        function loadData() {
            $.getJSON(ops.url, function (rd) {
                var data;
                if (ops.source == "") {
                    data = rd;
                } else {
                    var temp = rd;
                    var item = ops.source.split('.');
                    $.each(item, function (i, n) {
                        if (n != "") {
                            temp = temp[n];
                        }
                    });
                    data = temp;
                }
                ops.data = data;
                $(objthis).html(fillRootData());
                setdisplay();
                setSelected();
                if (ops.afterLoad) {
                    ops.afterLoad();
                }
            });
        }

        /**
        * 获取class
        * @method getClass
        * @param {object} classs class列表
        * @param {string} str 过滤后缀
        * @for Treejs
        */
        function getClass(node, str) {
            var ccs = node.attr("class").split(' ');
            var res;
            for (var i in ccs) {
                if (str == "close") {
                    res = ccs[i].match(/(.+?_close)/g);
                } else {
                    res = ccs[i].match(/(.+?_open)/g);
                }
                if (res) {
                    break;
                }
            }
            return res + "";
        }

        /**
        * 显示或隐藏子节点
        * @method setdisplay
        * @for Treejs
        */
        function setdisplay() {
            if (nodeicon == "close") {
                $(objthis).find(".fm-tree ul").hide();
            } else {
                $(objthis).find(".fm-tree ul").show();
                if (ops.clazz > 0) {//ico_close
                    $(objthis).find("span.ico_close").parent("a").siblings("ul").hide();
                }
            }
        }

        /**
        * 默认选中
        * @method setSelected
        * @for Treejs
        */
        function setSelected() {
            $(objthis).find("li.selected").each(function (i, n) {
                if (ops.treeModel == "default") {
                    if ($(n).children("ul").size() == 0) {
                        $(n).children("a").addClass("curSelectedNode");
                        $(n).parents("ul").show();
                        $(n).parents("ul").siblings("span.switch").each(function (i, n) {
                            var cs = getClass($(n), "close");
                            $(n).removeClass(cs).addClass(cs.replace("_close", "_open"));
                        });
                        $(n).parents("ul").siblings("a").each(function (i, n) {
                            var cs = getClass($(n).children("span"), "close");
                            $(n).children("span").removeClass(cs).addClass(cs.replace("_close", "_open"));
                        });
                    }
                } else if (ops.treeModel == "checkbox") {
                    if ($(n).children("ul").size() == 0) {
                        $(n).children("span.chk").removeClass("checkbox_false_full").addClass("checkbox_true_full_focus");
                    } else {
                        $(n).find("span.chk").removeClass("checkbox_false_full").addClass("checkbox_true_full_focus");
                    }
                    $(n).parents("ul").show();
                    $(n).find("ul").show();
                    $(n).parents("ul").siblings("span.switch").each(function (i, n) {
                        var cs = getClass($(n), "close");
                        $(n).removeClass(cs).addClass(cs.replace("_close", "_open"));
                    });
                    $(n).find("ul").siblings("span.switch").each(function (i, n) {
                        var cs = getClass($(n), "close");
                        $(n).removeClass(cs).addClass(cs.replace("_close", "_open"));
                    });

                    $(n).parents("ul").siblings("a").each(function (i, n) {
                        var cs = getClass($(n).children("span"), "close");
                        $(n).children("span").removeClass(cs).addClass(cs.replace("_close", "_open"));
                    });
                    $(n).find("ul").siblings("a").each(function (i, n) {
                        var cs = getClass($(n).children("span"), "close");
                        $(n).children("span").removeClass(cs).addClass(cs.replace("_close", "_open"));
                    });
                }
            });
        }

        /**
        * 填充root节点数据
        * @method fillData
        * @param {object} ops 控件参数对象
        * @param {string} template 填充模版
        * @for Treejs
        */
        function fillRootData() {
            var html = "<ul class=\"unstyled fm-tree\">";
            $.each(ops.data, function (i, n) {
                var cnt = "roots_" + nodeicon;
                if (i > 0 && i < ops.data.length - 1) {
                    cnt = "center_" + nodeicon;
                } else if (i > 0) {
                    cnt = "bottom_" + nodeicon;
                }
                counter = 0;
                html += fillLiData(n, cnt, "ico_" + nodeicon, ops.data.length - 1 == i);
            });
            html += "</ul>";
            return html;
        }

        /**
        * 填充child节点数据
        * @method fillLiData
        * @param {object} ops 控件参数对象
        * @param {string} template 填充模版
        * @for Treejs
        */


        function fillLiData(data, icon1, icon2, islast) {
            if (data) {
                var cnodeicon = false;
                if (ops.clazz > 0 && ops.expand && ops.clazz - 1 <= counter++) {
                    cnodeicon = true;
                }
                return node_li.replaceo("child", fillChildData(data[ops.child], islast, cnodeicon))
                .replaceo(ops.key, data[ops.key])
                .replaceo(ops.text, data[ops.text])
                .replaceo("icon1", icon1)
                .replaceo("diyicon", (data.Icon && data.Icon != "") ? "style=\"background: url(" + data.Icon + ") 0 0 no-repeat;\"" : "")
                .replaceo("selected", data.Selected ? "class=\"selected\"" : "")
                .replaceo("icon2", icon2);
            } else {
                return "";
            }
        }

        /**
        * 填充child节点数据
        * @method fillChildData
        * @param {object} ops 控件参数对象
        * @param {bool} islast 是否最后一个根节点
        * @for Treejs
        */
        function fillChildData(data, islast, cnodeicon) {
            if (data && data.length > 0) {
                var html = "<ul "
                html += islast ? ">" : "class=\"line\" >";
                $.each(data, function (i, n) {
                    var icon2 = "ico_" + (cnodeicon ? "close" : nodeicon);
                    var icon1 = data.length - 1 == i ? "bottom_" + (cnodeicon ? "close" : nodeicon) : "center_" + (cnodeicon ? "close" : nodeicon);
                    if (!n[ops.child] || n[ops.child].length == 0) {
                        icon2 = "ico_docu";
                        icon1 = data.length - 1 == i ? "bottom_docu" : "center_docu";
                    }
                    html += fillLiData(n, icon1, icon2, data.length - 1 == i);
                });
                html += "</ul>";
                return html;
            } else {
                return "";
            }
        }

        /**
        * 方法组
        * @method fnc
        * @for Treejs
        */
        var fnc = {
            remove: function (url, key) { },
            getSelected: function () {
                selData = new Array();
                if (ops.treeModel == "default") {
                    var seled = $(objthis).find("a.curSelectedNode");
                    $.each(seled, function (i, n) {
                        var id = $(n).attr("data-id");
                        var pid = $(n).parent("li").parent("ul").prev("a").attr("data-id");
                        if (id) {
                            selData.push({ key: id, pid: pid ? pid : 0, text: $(n).text() });
                        }
                    });
                } else if (ops.treeModel == "checkbox") {
                    var seled = $(objthis).find("span.checkbox_true_full_focus");
                    $.each(seled, function (i, n) {
                        //var isnode = $(n).siblings("ul").html();
                        var id = $(n).next("a").attr("data-id");
                        var pid = $(n).parent("li").parent("ul").prev("a").attr("data-id");
                        if (id) {
                            selData.push({ key: id, pid: pid ? pid : 0, text: $(n).text() });
                        }
                    });
                }
                return selData;
            },
            reload: function () {
                loadData();
            },
            refresh: function () {
                $(objthis).html(fillRootData());
                setdisplay();
            },
            setSelected: function (data) {
                if (ops.multiple) {
                    if (data instanceof Object) {
                        $.each(data, function (i, n) {
                            var objsel = $(objthis).find("[data-id=" + n + "]").eq(0);
                            if ($(objsel).get(0)) {
                                $(objsel).siblings(".chk").removeClass("checkbox_false_full").addClass("checkbox_true_full_focus");
                            }
                            if ($(objsel).nextAll("ul").get(0)) {
                                $(objsel).nextAll("ul").find(".chk").removeClass("checkbox_false_full").addClass("checkbox_true_full_focus");
                            }
                            selectParent($(objsel).siblings(".chk"));
                        })
                    } else {
                        var strs = data.split(',');
                        $.each(strs, function (i, n) {
                            var objsel = $(objthis).find("[data-id=" + n + "]").eq(0);
                            if ($(objsel).get(0)) {
                                $(objsel).siblings(".chk").removeClass("checkbox_false_full").addClass("checkbox_true_full_focus");
                                if (ops.treeModel != "checkbox") {
                                    $(objsel).addClass("curSelectedNode");
                                }
                            }
                            if ($(objsel).nextAll("ul").get(0)) {
                                $(objsel).nextAll("ul").find(".chk").removeClass("checkbox_false_full").addClass("checkbox_true_full_focus");
                            }
                            selectParent($(objsel).siblings(".chk"));
                        })
                    }
                } else {
                    var objsel = $(objthis).find("[data-id=" + data + "]").eq(0);
                    if (ops.treeModel != "checkbox") {
                        $(objsel).addClass("curSelectedNode");
                    }
                    if (!$(objsel).nextAll("ul").get(0)) {
                        $(objsel).siblings(".chk").removeClass("checkbox_false_full").addClass("checkbox_true_full_focus");
                    }
                }
            },
            getData: function () {
                return ops.data;
            },
            donSelect: function (key) {
                if(ops.treeModel=="checkbox"){
                    $(objthis).find("a[data-id=" + key + "]").prev("span.chk").removeClass("checkbox_true_full_focus").addClass("checkbox_false_full");
                } else {
                    $(objthis).find("a[data-id=" + key + "]").removeClass("curSelectedNode");
                }
            }
        }
        //递归选中需要选中的父节点
        function selectParent(obj) {
            var parent = $(obj).parent("li").parent("ul");
            if ($(parent).get(0)) {
                var size = $(parent).find(".checkbox_false_full").size();
                if (size == 0) {
                    $(parent).siblings(".chk").removeClass("checkbox_false_full").addClass("checkbox_true_full_focus");
                }
                selectParent($(parent).siblings(".chk"));
            }
        }
        return fnc;
    }

})(jQuery);/*!
 * 集成表格控件 
 *创建人：qinnailin
 * 创建时间：2014/11/11 尼玛个光棍节！！
 */


(function ($) {
    $.fn.uTable = function (opstions) {
        var ops = $.extend(true, {
            url: "",
            data: null,
            dataformat: {data:"Data",count:"Count"},
            click: null,
            dbclick: null,
            method: "Get",
            dataType: "json",
            sortMultiple: true,
            putJson: true,
            cache: true,
            multiple: true,
            cancel:true,
            page: {
                enable:true,
                click:null,
                pageSize: 30,
                pageIndex: 1,
                back: "上一页",
                next: "下一页",
                reqindex: "pageindex",
                reqsize: "pagesize"
            },
            afterLoad: null,
            checkbox: {
                enable: false
            },
            buttons: null,
            heads: []
        }, opstions);
        var objthis = $(this);
        $(objthis).addClass("container-fluid");
        $(objthis).addClass("layout-box");
        bindTool();
        bindTable();
        $(objthis).find(".layout-center").each(function (i, n) {
            findlayout($(n));
        });
        
        function bindTool() {
            if (!ops.buttons) return false;
            if (!$(objthis).find(".utable-tool").get(0)) {
                var html = "<div class=\"row-fluid layout-top utable-tool\" style='height:50px;' ></div>";
                $(objthis).append(html);
                $.each(ops.buttons,function (i, n) {
                    $("<button class='btn UTable-btn2 " + (n.style ? n.style : "") + "'"+ (n.funcId ? "funcId='" + n.funcId + "'" : "") +">" + n.text + "</button>").appendTo($(objthis).find(".utable-tool")).click(function () {
                        n.click();
                    });
                });
            }
        }
        function bindTable() {
            var html = "<div class=\"row-fluid layout-center\"><div class=\"layout-box\">";
            html += "<div class=\"row-fluid layout-top table_th "+(ops.buttons?"utable-hasbutton":"")+"\" style='height:30px; background:#f7f7f7; padding-right:17px;' >";
            html += "<table class='table' ><thead fm-head><tr>";
            if (ops.checkbox.enable && ops.multiple) {
                html += "<th ><input type='checkbox' class='chkAll' /></th>";
            } else if (ops.checkbox.enable){
                html += "<th ></th>";
            }
            $.each(ops.heads, function (i, n) {
                html += (n.sort ? "<th fm-sort='" + n.key + "' " + (n.width ? "width='" + n.width + "'" : '') + " >" : "<th " + (n.width ? "width='" + n.width + "'" : '') + ">") + n.name + "</th>";
            });
            html += "</tr></thead></table>";
            html += "</div><div class=\"row-fluid layout-center\" style='overflow-y:scroll'>";
            html += "<table class='table scroll_table table_hover table_ch_c'  ><tbody fm-body><tr>";
            if (ops.checkbox.enable) {
                html += "<td ><input type='checkbox' /></td>";
            }
            $.each(ops.heads, function (i, n) {
                html += "<td " + (n.conver ? "fm-conver='" + n.conver + "'" : "") + " " + (n.width ? "width='" + n.width + "'" : '') + " >{{" + n.key + "}}</td>";
            });
            html +="</tr></tbody></table>";
            html += "</div>";
            if (ops.page.enable) {
                html += "<div class=\"row-fluid layout-bottom\" style='height:35px;' ><div fm-pagerbox class=\"tfoot\"></div></div>";
            }
            html += "</div></div>";
            $(objthis).append(html);
        }
        
        if (ops.page.click) {
            var tempc = ops.page.click;
            ops.page.click = function () {
                $(objthis).find(".chkAll").removeAttr("checked");
                tempc();
            }
        } else {
            ops.page.click = function () {
                $(objthis).find(".chkAll").removeAttr("checked");
            }
        }

        $(document).ready(function () {
            $(objthis).find("[fm-body]").on("click", "tr", function () {
                var row = $(this);
                if (row.hasClass("checked_tr")) {
                    if (ops.cancel) {
                        $(row).removeClass("checked_tr");
                        $(row).find("input[type='checkbox']").removeAttr("checked");
                        $(objthis).find(".chkAll").removeAttr("checked");
                    }
                } else {
                    if (!ops.multiple) {
                        $(objthis).find("[fm-body] input[type='checkbox']").removeAttr("checked");
                        $(objthis).find("[fm-body]>tr").removeClass("checked_tr");
                    }
                    $(row).addClass("checked_tr");
                    $(row).find("input[type='checkbox']").attr("checked", "checked");
                    if ($(objthis).find("[fm-body] input:checked").size() == $(objthis).find("[fm-body]>tr").size()) {
                        if (ops.multiple) {
                            $(objthis).find(".chkAll").attr("checked", "checked");
                        }
                    }
                }
            });
            $(objthis).on("click", ".chkAll", function () {
                if ($(this).attr("checked") == "checked") {
                    $(objthis).find("[fm-body] input[type='checkbox']").attr("checked", "checked");
                    $(objthis).find("[fm-body]>tr").addClass("checked_tr");
                } else {
                    $(objthis).find("[fm-body] input[type='checkbox']").removeAttr("checked").removeClass("checked_tr");
                    $(objthis).find("[fm-body]>tr").removeClass("checked_tr");
                }
            });
        });

        var utable = $(objthis).Grid(ops);
        var res = {
            utable: utable,
            getSelectData: function () {//获取选中内容
                var arr = new Array();
                var data = utable.getData();
                $(objthis).find("[fm-body]>tr.checked_tr").each(function (i, n) {
                    arr.push($(n).data("jsondata"));
                });
                return arr;
            },
            refresh: function () {
                utable.refresh();
            },
            reload: function () {
                utable.reload();
            },
            load: function (opst) {
                utable.load(opst);
            }
        }
        return res;
    }
})(jQuery);/*!
 * 树控件
 * 创建人：qinnailin
 * 创建时间：2014/10/17
 */


(function ($) {
    $.fn.uTree = function (opstions) {
        var setting = $.extend(true, {
            treeId: "",
            treeObj: null,
            view: {
                addDiyDom: null,
                autoCancelSelected: true,
                dblClickExpand: true,
                expandSpeed: "fast",
                fontCss: {},
                nameIsHTML: false,
                selectedMulti: true,
                showIcon: true,
                showLine: false,
                showTitle: true,
                txtSelectedEnable: false,
                expand:-1//设置节点展开层级，默认-1不展开
            },
            check: {
                enable: false,
                chkStyle: "checkbox",
                chkboxType: { "Y" : "ps", "N" : "ps" }
            },
            data: {
                key: {
                    children: "Child",
                    name: "Name",
                    title: "",
                    url: "url"
                },
                simpleData: {
                    enable: false,
                    idKey: "Id",
                    pIdKey: "PId",
                    rootPId: null
                },
                keep: {
                    parent: false,
                    leaf: false
                },
                Nodes:null
            },
            callback: {
                beforeAsync:null,
                beforeClick:null,
                beforeDblClick:null,
                beforeRightClick:null,
                beforeMouseDown:null,
                beforeMouseUp:null,
                beforeExpand:null,
                beforeCollapse:null,
                beforeRemove:null,

                onAsyncError:null,
                onAsyncSuccess:null,
                onNodeCreated: null,
                onClick:null,
                onDblClick:null,
                onRightClick:null,
                onMouseDown:null,
                onMouseUp:null,
                onExpand:null,
                onCollapse:null,
                onRemove: null,

                afterLoad:null
            }
        }, opstions);
        var objthis = $(this);
        var strid = $(objthis).attr("id");
        if (!objthis.hasClass("ztree")) {
            objthis.addClass("ztree");
        }
        var zTree;
        try {
            if (setting.view.expand != -1) {//设置为展开时
                var oncreatefun;
                if (setting.callback.onNodeCreated != null) {
                    oncreatefun = setting.callback.onNodeCreated;
                }
                setting.callback.onNodeCreated = function (e, treeId, treeNode) {
                    var zTreeo = $.fn.zTree.getZTreeObj(strid);
                    if (treeNode.level <= setting.view.expand) {
                        zTreeo.expandNode(treeNode, null, null, null, true);
                    }
                    if (oncreatefun) {
                        oncreatefun(e, treeId, treeNode);
                    }
                }
            }
            var tempfunc = setting.callback.onAsyncSuccess;
            setting.callback.onAsyncSuccess = function (event, treeId, treeNode, msg) {
                if (tempfunc) {
                    tempfunc(event, treeId, treeNode, msg);
                }
                if (setting.callback.afterLoad) {
                    setting.callback.afterLoad();
                }
                var selnodes = [];
                if (setting.check.enable) {
                    selnodes = zTree.getCheckedNodes(true);

                } else {
                    selnodes = zTree.getSelectedNodes();
                }
                $.each(selnodes, function (i, n) {
                    expandpNode(n);
                });
            }
            zTree = $.fn.zTree.init(objthis, setting, setting.data.Nodes);
            if (setting.async==undefined||!setting.async.enable) {
                if (setting.callback.afterLoad) {
                    setting.callback.afterLoad();
                }
                var selnodes = [];
                if (setting.check.enable) {
                    selnodes = zTree.getCheckedNodes(true);

                } else {
                    selnodes = zTree.getSelectedNodes();
                }
                $.each(selnodes, function (i, n) {
                    expandpNode(n);
                });
            }
        } catch (e) {
            alertui("请引入zTree类库!");
            console.debug(e);
        }
        //拓展方法
        $.extend(true, zTree, {
            setSelected: function (obj) {
                var nodes = zTree.transformToArray(zTree.getNodes());
                var selid = obj.split(',');
                for (var i = 0; i < selid.length; i++) {
                    for (var j = 0; j < nodes.length; j++) {
                        if (nodes[j][setting.data.simpleData.idKey] == selid[i]) {
                            if (setting.check.enable) {
                                zTree.checkNode(nodes[j], true, true);
                            } else {
                                zTree.selectNode(nodes[j], setting.view.selectedMulti);
                            }
                            break;
                        }
                    }
                }
                var selnodes = [];
                if (setting.check.enable) {
                    selnodes = zTree.getCheckedNodes(true);
                    
                } else {
                    selnodes = zTree.getSelectedNodes();
                }
                $.each(selnodes, function (i, n) {
                    expandpNode(n);
                });
            },//选择
            donSelect: function (id) {
                if (setting.check.enable) {
                    var selnode = zTree.getCheckedNodes(true);
                    for (var i = 0; i < selnode.length; i++) {
                        if (selnode[i][setting.data.simpleData.idKey] == id) {
                            zTree.checkNode(selnode[i], false, true);
                            break;
                        }
                    }
                } else {
                    var selnode = zTree.getSelectedNodes();
                    for (var i = 0; i < selnode.length; i++) {
                        if (selnode[i][setting.data.simpleData.idKey] == id)
                        {
                            zTree.cancelSelectedNode(selnode[i]);
                            break;
                        }
                    }
                }
            }
        });
        //展开父节点
        function expandpNode(nodes) {
            zTree.expandNode(nodes, true, false,false, false);
            var pnode = nodes.getParentNode();
            if (pnode) {
                expandpNode(pnode);
            }
        }
        return zTree;
    }
})(jQuery);