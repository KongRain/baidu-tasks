/**
 * Created by xyk on 2015/6/15.
 */
(function() {
    var tClass = document.getElementById("task-class");
    var tList = document.getElementById("task-list");
    var tDetail = document.getElementById("task-detail");
    var classList = document.getElementsByClassName("class-list")[0];
    var data;

    /**
     * 任务类型列表
     */
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

    function CreateLi (type) {
        var type = type ? type : "folder";
        var li = document.createElement("li");
        var p = document.createElement("p");
        var i = document.createElement("i");
        var span = document.createElement("span");
        addClass(i, "icon");
        addClass(i, type);
        p.appendChild(i);
        p.appendChild(span);
        li.appendChild(p);
        return li;
    }
    CreateLi.prototype = {
        constructor: CreateLi,

    }

    function initTC(xhr, text) {
        var text = JSON.parse(text);
        var list = tClass.getElementsByClassName("class-list")[0];
        var num = text.length;
        for(var i=0; i<num; i++) {
            var name = text[i].class;
            var files = text[i].file;
            var len = files.length;
            var li = new CreateLi("folder");
            var span = li.getElementsByTagName("span")[0];
            span.innerHTML = name + "(" + len + ")";
            list.appendChild(li);
        }
    }

    function failHandler(xhr) {
        console.log(xhr.error);
    }

    function onMouseEnter(e) {
        var selector = "li";
        var event = e || window.event,
            target = event.target || event.srcElement,
            related = event.relatedTarget || event.fromElement,
            match;
        while(target && target != document && !(match = matches(target, selector))) {
            target = target.parentNode;
        }
        if(!match) {return;}
        while(related && related != document && related != target) {
            related = related.parentNode;
        }
        //消除内部干扰
        if(related == target) {return;}

        target.style.backgroundColor = "#B5B5B5";
    }

    function onMouseLeave(e) {
        var selector = "li";
        var event = e || window.event,
            target = event.target || event.srcElement,
            related = event.relatedTarget || event.toElement,
            match;

        while(target && target != document && !(match = matches(target, selector))) {
            target = target.parentNode;
        }
        if(!match) {return;}
        while(related && related != document && related != target) {
            related = related.parentNode;
        }
        if(related == target) {return;}

        target.style.background = "transparent";
    }

    function matches(ele, selector) {
        return ele.mozMatchesSelector(selector);
    }

    /*function clickHandler() {

    }*/

    window.onload = function() {
        var options = {
            type: "GET",
            data: {},
            onsuccess: initTC,
            onfail: failHandler
        };
        ajax("file_data.json", options);
        addEvent(classList, "mouseover", function(e) {
            onMouseEnter(e);
        });
        addEvent(classList, "mouseout", function(e) {
            onMouseLeave(e);
        });
    }

})();
