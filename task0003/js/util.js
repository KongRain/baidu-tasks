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
            handler(xhr, xhr.responseText);
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