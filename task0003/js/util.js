/**
 * Created by xyk on 2015/6/23.
 */
/**
 * Ajax获取json数据
 * @param {string} url 请求的url
 * @param {object} options 请求的类型数据等参数
 * @config {string} [options.type] 请求的类型，默认为GET
 * @config {object} [options.data] 需要发送的数据
 * @config {Function} [options.onsuccess] 请求成功后执行的函数，function(XMLHttpRequest xhr, String responsText)
 * @config {Function} [options.onfail] 请求失败后执行的函数 function(XMLHttpRequest xhr)
 *
 * @returns {XMLHttpRequest} 发送请求的XMLHttpRequst对象
 */
function ajax(url, options) {
    var target = this;
    var options = options || {};
    var type = (options.type || "GET").toUpperCase();
    var data = stringifyData(options.data || {});
    var xhr;
    var eventHandler = {
        onsuccess: options.onsuccess,
        onfail: options.onfail
    };

    try{
        if(type == "GET" && data) {
            url += (url.indexOf("?") >= 0) ? ("&" + data) :("?" + data);
            data = null;
        }

        xhr = getXHR();
        xhr.open(type, url, true);
        xhr.onreadystatechange = stateChangeHandler;
        xhr.setRequestHeader("Content-type", "application/json");

        if(type == "POST") {
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        }
        xhr.setRequestHeader("X-Requested-Width", "XMLHttpRequest");
        xhr.send(data);
    }
    catch(e) {
        fire("fail");
    }

    return xhr;

    function stringifyData(data) {
        var param = [];
        for(var key in data) {
            if(data.hasOwnProperty(key)) {
                param.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
            }
        }
        return param.join("&");
    }

    function getXHR() {
        if(window.ActiveXObject) {
            try {
                return new ActiveXObject("Msxml2.XMLHTTP");
            }
            catch(e) {
                try {
                    return new ActiveXObject("Microsoft.XMLHTTP");
                }
                catch(e) {
                }
            }
        } else if(window.XMLHttpRequest) {
            return new XMLHttpRequest();
        }
    }

    function stateChangeHandler() {
        var stat = xhr.status;
        if(xhr.readyState === 4) {
            if((stat>=200 && stat<300) || stat == 304) {
                fire("success");
            } else {
                fire("fail");
            }
        }
    }

    function fire(type) {
        var type = "on" + type;
        var handler = eventHandler[type];
        if(!handler) {
            return;
        }
        if(type == "onfail") {
            handler(xhr);
        } else if(type == "onsuccess") {
            handler.call(target, xhr, xhr.responseText);
        }
    }
}

/**
 * 事件
 */
function addEvent(ele, type, listener) {
    var type = type.replace(/^on/, "").toLowerCase();

    if(ele.addEventListener) {
        ele.addEventListener(type, listener, false);
    }
    else if(ele.attachEvent){
        ele.attachEvent("on" + type, listener);
    }
}

function removeEvent(ele, type, listener) {
    var type = type.replace(/^on/, "").toLowerCase();

    if(ele.removeEventListener) {
        ele.removeEventListener(type, listener, false);
    }
    else if(ele.detachEvent) {
        ele.detachEvent("on" + type, listener);
    }
}

function delegateEvent(ele, tag, type, listener) {
    addEvent(ele, type, function(e) {
        var event = e || window.event;
        var target = e.target || e.srcElement;
        var tagName = target.nodeName.toLowerCase();
        if(tagName == tag.toLowerCase()) {
            listener.call(target, event);
        }
    });
}

function getTarget(e) {
    var event = e || window.event;
    var target = e.srcElement || e.target;
    return target;
}
/*
对象
 */
function objLen(obj) {
    var len = 0;
    for(var name in obj) {
        if(obj.hasOwnProperty(name)) {
            len++;
        }
    }
    return len;
}

function addClass(ele, name) {
    var oldClass = ele.className;
    if(oldClass.length == 0) {
        ele.className = name;
    } else {
        var oldArray = oldClass.split(/\s/);
        for(var i = 0, len = oldArray.length; i < len; i++) {
            if(oldArray[i] == name) {
                return;
            }
        }
        ele.className += " " + name;
    }
}

function removeClass(ele, name) {
    var oldClass = ele.className;
    if(oldClass.length == 0) return;
    var oldArray = oldClass.split(/\s/);
    for(var i = 0, len = oldArray.length; i < len; i++) {
        if(oldArray[i] == name) {
            oldArray.splice(i, 1);
        }
    }
    var newClass = oldArray.join(" ");
    ele.className = newClass;
}

function hasClass(element, className) {
    if(element.classList.contains(className)) {
        return true;
    } else {
        return false;
    }
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



