/*JavaScript数据类型及语言基础
==================================================================================
 */

//判断arr是否为数组，并返回一个bool值
function isArray(arr) {
	if(Object.protoytype.toString.call(arr) === '[object Array]') {
        return true;
    } else {
        return false;
    }
}


//判断fn是否为函数，并返回一个bool值
function isFunction(fn) {
	return Object.prototype.toString.call(fn) === '[object Function]';
}


//使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
//被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。不会包含函数、正则对象等
function cloneObject(src) {
	var result = src;
    var type = Object.prototype.toString.call(src);
    if(!src || type === '[object Number]' || type === '[object String]' || type === '[object Boolean]') {
        return result;
    } else if(type === '[object Array]') {
        result = [];
        for(var i=0, len = src.length; i<len; i++) {
            result[i] = cloneObject(src[i]);
        }
    } else if(type === '[object Object]') {
        result = {};
        for(var i in src) {
            if(src.hasOwnProperty(i)) {
                result[i] = cloneObject(src[i]);
            }
        }
    }

    return result;
}


//对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组
function uniqArray(arr) {
    if(!isArray(arr)) return arr;
    var result = [];
    var hash = {};
    for(var i=0, len=arr.length; i<len; i++) {
        var key = arr[i];

        if(!hash[key]) {
            result.push(key);
            hash[key] = 1;
        }
    }
    return result;
}


// 实现一个简单的trim函数，用于去除一个字符串，头部和尾部的空白字符
// 假定空白字符只有半角空格、Tab
function simpleTrim(str) {
    if(str != null) {
        var i = 0;
        var start = 0;
        var end = str.length;
        while(str[i] == " " || str[i] == "  ") {
            start++;
            i++
        }
        i = str.length-1;
        while(str[i] == " " || str[i] == "  ") {
            end--;
            i--;
        }
        var sub = str.substring(start, end);
        return sub;
    }
    return;
}


// 尝试使用一行简洁的正则表达式完成该题目
function trim(str) {
    return str.replace(/^\s*|\s*$/g, "");
}


//实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
function fn(index, item) {
    console.log(index + ": " + item);
}
function each(arr, fn) {
    
    for(var i = 0, len = arr.length; i < len; i++) {
        fn(i, arr[i]);
    }
}


// 获取一个对象里面第一层元素的数量，返回一个整数
function getObjectLength(obj) {
    var len = 0;
    for(var attr in obj) {
        if(obj.hasOwnProperty(attr)) {
            len++;
        }
    }
    return len;
}


/* DOM
=========================================================================
 */

// 为element增加一个样式名为newClassName的新样式
function addClass(element, newClassName) {
    var result;
    if(typeof newClassName === 'string') {
        var classes = (newClassName || '').match(/\S+/g) || [];
        var elementClass = element.className;
        var cur = element.nodeType === 1 && (elementClass ?
            (' ' + elementClass + ' ').replace(/[\t\r\n\f]/g, ' ') :
            ' ');
        if(cur) {
            var len = classes.length;
            for(var i = 0; i < len; i++) {
                if(cur.indexOf(' ' + classes[i] + ' ') < 0) {
                    cur += classes[i] + ' ';
                }
            }
        }
        result = trim(cur);
        if(elementClass != result) {
            element.className = result;
        }
    }
}


//移除element中的样式oldClassName
function removeClass(element, oldClassName) {
    if(element.classList.contains(oldClassName)) {
        element.classList.remove(oldClassName);
    } else
        return element;
}

//判断一个元素是否有className类
function hasClass(element, className) {
    if(element.classList.contains(className)) {
        return true;
    } else {
        return false;
    }
}


//判断siblingNode和element是否为同一个父元素下的同一级的元素，返回bool值
function isSiblingNode(element, siblingNode) {
    if(!element || !siblingNode) {
        return false;
    }
    else {
        var father = element.parentNode;
        if(father) {
            console.log(siblingNode.parentNode === father ? true : false);
        }
    }
}


//获取element相对于浏览器窗口的位置，返回一个对象{x, y}
function getPosition(element) {
    var position = new Object();
    var left = element.offsetLeft;
    var top = element.offsetTop;
    var parent = element.offsetParent;
    var scrollLeft, scrollTop;
    while(parent) {
        left += parent.offsetLeft;
        top += parent.offsetTop;
        parent = parent.offsetParent;
    }
    if(document.compatMode == "BackCompat") {
        scrollLeft = document.body.scrollLeft;
        scrollTop = document.body.scrollTop;
    } else {
        scrollLeft = document.documentElement.scrollLeft;
        scrollTop = document.documentElement.scrollTop;
    }
    position.x = left - scrollLeft;
    position.y = top - scrollTop;
    return position;
}

//设置一个元素相对窗口的坐标位置
function setPosition(element, x, y) {
    var scrollLeft, scrollTop, parent, left, top;
    parent = element.offsetParent;
    if(document.compatMode == "BackCompat") {
        scrollLeft = document.body.scrollLeft;
        scrollTop = document.body.scrollTop;
    } else {
        scrollLeft = document.documentElement.scrollLeft;
        scrollTop = document.documentElement.scrollTop;
    }
    left = x + scrollLeft;
    top = y + scrollTop;
    while(parent) {
        left -= parent.offsetLeft;
        top -= parent.offsetTop;
        parent = parent.offsetParent;
    }
    element.style.left = left + "px";
    element.style.top = top + "px";
}


//实现一个简单的jQuery
function $(sector) {
    if(!sector || typeof sector != "string") {
        return false;
    }
    var element;
    var reg = /\s+/;

    if(!reg.test(sector)) {
        //sector中不包含层级关系
        element = noGrade(document, sector)[0];
    } else {
        var subSectors = sector.split(" ");
        //假设只有两级
        var firstList = noGrade(document, subSectors[0]);
        for(var i=0; i<firstList.length; i++) {
            var secondList = noGrade(firstList[i], subSectors[1]);
            if(secondList.length) {
                element = secondList[0];
                break;
            }
        }
    }
    return element;
}

//事件
$.on = function(sector, event, listener) {
    var element = $(sector);
    return addEvent(element, event, listener);
};
$.un = function(sector, event, listener){
    var element = $(sector);
    return removeEvent(element, event, listener);
};
$.click = function(sector, listener) {
    var element = $(sector);
    return addClickEvent(element, listener);
};
$.enter = function(sector, listener) {
    var element = $(sector);
    return addEnterEvent(element, listener);
};
$.delegate = function(sector, tag, event, listener) {
    var element = $(sector);
    return delegateEvent(element, tag, event, listener);
};


//通过属性获得元素（for function $()）
function getElementsByAttr(parent, attr, value) {
    if(!parent || !attr) {
        return false;
    }
    var allChild = parent.getElementsByTagName("*");
    var results = new Array();
    var flag = value ? 1 : 0;       //要选择属性值：1；不选择属性值：0
    for(var i=0; i<allChild.length; i++) {
        if(allChild[i].hasAttribute(attr)) {
            var item = allChild[i];
            if(flag) {
                if(item.getAttribute(attr) == value) {
                    results.push(item);
                }
            } else {
                results.push(item);
            }
        }
    }
    return results;
}


//没有层级关系的元素提取函数（for function $()）
function noGrade(parent, sector) {
    if(!parent || !sector || typeof sector != "string") {
        return false;
    }
    var eleList = new Array();
    var substr, element;
    switch(sector[0]) {
        case "#":
            substr = sector.slice(1);
            element = parent.getElementById(substr);
            eleList.push(element);
            break;
        case ".":
            substr = sector.slice(1);
            eleList = parent.getElementsByClassName(substr);
            break;
        case "[":
            if(sector.search(/=/g) == -1) {
                //只有属性名称，无属性值
                substr = sector.slice(1, -1);
                eleList = getElementsByAttr(parent, substr);
                break;
            } else {
                //包含属性名与属性值
                var re = /^\[(\w+)\s*=\s*('|")(\w+)('|")\]$/g;
                var result = re.exec(sector);
                var attr =  result[1];
                var val = result[3];
                eleList = getElementsByAttr(parent, attr, val);
            }
            break;
        default:
            eleList = parent.getElementsByTagName(sector);
    }
    return eleList;
}

/* 事件
==============================================================================
 */

// 给一个element绑定一个针对event事件的响应，响应函数为listener
function addEvent(element, event, listener) {
    if(element.addEventListener) {
        element.addEventListener(event, listener, false);
    } else if(element.attachEvent) {
        element.attachEvent("on"+event, listener);
    } else {
        element["on"+event] = listener;
    }
}


// 移除element对象对于event事件发生时执行listener的响应
function removeEvent(element, event, listener) {
    if(element.removeEventListener) {
        element.removeEventListener(event, listener, false);
    } else if(element.detachEvent) {
        element.detachEvent("on"+event, listener);
    } else {
        element["on"+event] = null;
    }
}


// 实现对click事件的绑定
function addClickEvent(element, listener) {
    addEvent(element, "click", listener);
}

// 实现对于按Enter键时的事件绑定
function addEnterEvent(element, listener) {
    addEvent(element, "keypress", function(e) {
        var event = e || window.event;
        if(event.keyCode == 13) {
            listener(event);
        }
    });
}

//事件代理
//一个问题：怎么把listener函数的参数传进去？
function delegateEvent(element, tag, eventName, listener) {
    addEvent(element, eventName, function(e) {
        var e = e|| window.event;
        var target = e.target ? e.target : e.srcElement;
        var nodeName = target.nodeName.toLowerCase();
        if(nodeName == tag && target != element) {
            listener(e);
        }
    })
}


/* BOM
=====================================================================================
 */

//判断浏览器是否为IE浏览器，返回-1或版本号
function isIE() {
    if(window.attachEvent) {
        var ua = navigator.userAgent;
        return ua.match(/msie([\d.]+)/)[1];
    } else {
        return -1;
    }
}

//设置cookie chrome下无法使用
function setCookie(cookieName, cookieValue, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = cookieName + "=" + encodeURIComponent(cookieValue);
    document.cookie += (expiredays ? (";expires=" + exdate.toUTCString()) : "");
}

//获取cookie的值
function getCookie(cookieName) {
    var begin = document.cookie.indexOf(cookieName);
    if(begin != -1) {
        begin += cookieName.length + 1;
        var end = document.cookie.indexOf(";", begin);
        if(end == -1) {
            end = document.cookie.length;
        }
        return decodeURIComponent(document.cookie.substr(begin, end));
    } else {
        return "";
    }
}

/* Ajax
===============================================================================
 */

function ajax(url, options) {
    var xmlhttp,
        type = options.type || "GET",
        data = options.data || {};

    if(window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        // for IE5, IE6
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            if(options.onsuccess) {
                options.onsuccess(xmlhttp.responseText, xmlhttp);
            }
        } else if(xmlhttp.readyState == 4 && xmlhttp.status == 404) {
            if(options.onfail) {
                options.onfail(xmlhttp.responseText, xmlhttp);
            }
        }
    }

    if(type.toUpperCase() == "GET") {
        url += "?";
        for(var obj in data) {
            var val = data[obj];
            url += obj + "=" + val + "&";
        }
        var relurl = url.substr(0, url.length-1);
        xmlhttp.open("GET", relurl, true);
        xmlhttp.send();
    } else {
        var sendmsg = "";
        for(var obj in data) {
            var val = data[obj];
            sendmsg += obj + "=" + val + "&";
        }
        sendmsg = sendmsg.substr(0, sendmsg.length-1);
        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(sendmsg);
    }
}

