console.log('util加载成功');

define(function() {
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
	        var target = getTarget(e);
	        var tagName = target.nodeName.toLowerCase();
	        while(tagName != tag && target != ele) {
	            target = target.parentNode;
	            tagName = target.nodeName.toLowerCase();
	        }

	        if(tagName == tag) {
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

	function trim(str) {
	    return str.replace(/^\s*|\s*$/g, "");
	}

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

	function removeClass(ele, name) {
	    var oldClass = ele.className;
	    if(oldClass.length == 0) return;
	    var oldArray = oldClass.split(/\s+/);
	    for(var i = 0, len = oldArray.length; i < len; i++) {
	        if(oldArray[i] == name) {
	            oldArray.splice(i, 1);
	        }
	    }
	    var newClass = oldArray.join(" ");
	    ele.className = newClass;
	}

	function hasClass(element, className) {
	    if(className && element.className) {
	    	var classes = element.className.split(/\s+/);
	    	for(var i=0, len=classes.length; i<len; i++) {
	    		if(className === classes[i]) {
	    			return true;
	    		}
	    	}
	    }
	    
	    return false;
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

	function createDOMByStr(str) {
	    var div = document.createElement('div');
	    div.innerHTML = str;
	    return div.childNodes;
	}

	function getViewWidth() {
		var width = window.innerWith || document.documentElement.clientWidth 
		|| document.body.clientWidth;

		console.log('viewPortwidth:' + width);

		return width;

	}


	return {
		addEvent:       addEvent,
		removeEvent:    removeEvent,
		delegateEvent:  delegateEvent,
		getTarget:      getTarget,
		objLen:         objLen,
		addClass:       addClass,
		removeClass:    removeClass,
		hasClass:       hasClass,
		$:              $,
		createDOMByStr: createDOMByStr,
		getViewWidth:   getViewWidth,
		appMaxWith:     767
	}

});