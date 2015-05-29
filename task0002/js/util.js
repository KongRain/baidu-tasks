/* JavaScript数据类型及语言基础
=================================================================================
*/

//判断arr是否为数组，并返回一个bool值
function isArray(arr) {
	console.log(arr instanceof Array);
}

//测试用例
var arr1 = [1,3,4];
isArray(arr1);       //true


//判断fn是否为函数，并返回一个bool值
function isFunction(fn) {
	//方法一 用typeof操作符
	if(typeof fn === "function")
	    console.log(true);
	else
	    console.log(false);
	//方法二 用instanceof操作符
	console.log(fn instanceof Function);
}

//测试用例
var fn1 = function() {
	alert("hello world!");
}
isFunction(fn1);     //true


//使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
//被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。不会包含函数、正则对象等
function cloneObject(src) {
	if (typeof src === "object") {
		var dst = new Object();
		for (var attr in src) {
			if (typeof src[attr] !== "object" && typeof src[attr] !== "undefined") {
				dst[attr] = src[attr];
			}
			else {
				dst[attr] = cloneObject(src[attr]);
			}
		}
		return dst;
	}
}

//测试用例
var srcObj = {
    a: [1, 2, 3],
    b: {
        b1: ["hello", "hi"],
        b2: "JavaScript"
    }
};
var abObj = srcObj;
var tarObj = cloneObject(srcObj);

srcObj.a = [2, 3, 4];
srcObj.b.b1[0] = "Hello";

console.log(abObj.a[0]);       //2
console.log(abObj.b.b1[0]);    //hello

console.log(tarObj.a[0]);     // 1
console.log(tarObj.b.b1[0]);    //Hello


//对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组
function uniqArray(arr) {
    if(!arr instanceof Array)
        return;
    else {
        var uniqArr = new Array();
        arr.sort();
        for(var i=0; i<arr.length; i++) {
            if(i == 0 || arr[i] != uniqArr[uniqArr.length-1]) {
                uniqArr.push(arr[i]);
            }
            else
                continue;
        }
    }
    return uniqArr;
}

//测试用例
var a = [1, 3, 5, 7, 5, 3];
var b = uniqArray(a);
console.log(b);    //[1, 3, 5, 7]


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

//测试用例
var str1 = "     kxy ";
console.log(simpleTrim(str1));


// 尝试使用一行简洁的正则表达式完成该题目
function trim(str) {
    return str.replace(/^\s*|\s*$/g, "");
}

//测试用例
var str2 = "  hi!  ";
console.log(trim(str2));


//实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
function fn(index, item) {
    console.log(index + ": " + item);
}
function each(arr, fn) {
    var i = 0;
    for(; i != arr.length; i++) {
        fn(i, arr[i]);
    }
}

//测试用例
var arr2 = ["kxy", "loves", "JavaScript"];
each(arr2, fn);


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

//测试用例
var obj = {
    a: 1,
    b: 2,
    c: {
        c1: 3,
        c2: 4
    }
}
console.log(getObjectLength(obj));

/* DOM
=========================================================================
 */

// 为element增加一个样式名为newClassName的新样式
function addClass(element, newClassName) {
    /*if(!element.className) {
        element.className = newClassName;
    }
    else {
        var finnalClass = element.className;
        finnalClass += " ";
        finnalClass += newClassName;
        element.className = finnalClass;
    }*/
    //改进方法
    element.classList.add(newClassName);
}

//测试用例
//var red = document.getElementsByTagName("p")[0];
//addClass(red, "big");


//移除element中的样式oldClassName
function removeClass(element, oldClassName) {
    if(element.classList.contains(oldClassName)) {
        element.classList.remove(oldClassName);
    }
    else
        return false;
}

//测试用例
//removeClass(red, "red");


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

//测试用例
//var number1 = document.getElementById("number1");
//var html = document.getElementsByTagName("html")[0];
//isSiblingNode(red, number1);    //true
//console.log(html.parentNode);   //#document


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
    }
    else {
        scrollLeft = document.documentElement.scrollLeft;
        scrollTop = document.documentElement.scrollTop;
    }
    position.x = left - scrollLeft;
    position.y = top - scrollTop;
    return position;
}


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
            if(flag) {
                if(this.getAttribute(attr) == value) {
                    results.push(this);
                }
            }
            else {
                results.push(this);
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
            if(!sector.search(/=/g)) {
                //只有属性名称，无属性值
                substr = sector.slice(1, -1);
                eleList = getElementsByAttr(parent, substr);
                break;
            }
            else {
                //包含属性名与属性值
                var re = /^\[(\w+)\s*=\s*(\w+)\]$/g;
                var result = re.exec(sector);
                var attr =  result[1];
                var val = result[2];
                eleList = getElementsByAttr(parent, attr, val);
            }
            break;
        default:
            eleList = parent.getElementsByTagName(sector);
    }
    return eleList;
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
    }
    else {
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

//测试用例
console.log($(".red .big"));