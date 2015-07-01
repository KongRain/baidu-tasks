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
            addEvent(li, "click", clickHandler);
        }
    }

    function failHandler(xhr) {
        console.log(xhr.error);
    }

    /**
     * 鼠标进入 退出
     */
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
        return ele.webkitMatchesSelector(selector);
    }

    function clickHandler() {
        var subList = this.getElementsByTagName("ul")[0];

        if(subList) {
            this.removeChild(subList);
        }else {
            var className = this.getElementsByTagName("span")[0].innerHTML;
            className = className.replace(/\s*\(\d+\)$/, "");
            var options = {
                type: "GET",
                data: {
                    "class": className
                },
                onsuccess: getData,
                onfail: failHandler
            };
            ajax.call(this, "file_data.json", options);
        }
    }


    function initSubTC(obj) {
        if(obj) {
            var len = obj.length;
            var ul = document.createElement("ul");
            this.appendChild(ul);
            for(var j=0; j<len; j++) {
                var fileName = obj[j].fname;
                var tasks = obj[j].task;
                var li = CreateLi("file");
                var span = li.getElementsByTagName("span")[0];
                span.innerHTML = fileName + "(" + tasks.length + ")";
                ul.appendChild(li);
                addEvent(li, "click", subClickHandler);
            }
        }
    }

    function subClickHandler(e) {
        var event = e || window.event;
        if(event.cancelBubble) {
            event.cancelBubble = true;
        } else {
            event.stopPropagation();
        }

        var parent = this.parentNode;
        while(parent.nodeName.toLowerCase() != "li") {
            parent =  parent.parentNode;
        }
        var className = parent.getElementsByTagName("span")[0].innerHTML;
        className = className.replace(/\s*\(\d+\)$/, "");
        var fileName = this.getElementsByTagName("span")[0].innerHTML;
        fileName = fileName.replace(/\s*\(\d+\)$/, "");
        var options = {
            type: "GET",
            data: {
                "class": className,
                "fname": fileName
            },
            onsuccess: getData,
            onfail: failHandler
        }
        ajax.call(this, "file_data.json", options);
    }

    //初始化任务列表 包括所有、完成、未完成
    function initTask(obj) {
       if(obj) {
           var len = obj.length;
           var date = [];
           var space = tList.getElementsByClassName("body")[0];
           //清空下属列表
           var lists = space.children;
           var allList = lists[0],
               unDoneList = lists[1],
               doneList = lists[2];
           for(var j = 0, length = lists.length; j < length; j++) {
               lists[j].innerHTML = "";
           }

           var head = tList.getElementsByClassName("head")[0].getElementsByTagName("li");
           var b_all = head[0],
               b_undone = head[1],
               b_done = head[2];
           for(var j = 0, hNum = head.length; j < hNum; j++) {
               head[j].className = "";
           }

           for(var i=0; i<len; i++) {
               var that = obj[i];
               newTask(that);
           }
           initDone();
           initUndone();

           addClass(b_all, "active");
           allList.style.display = "block";
           doneList.style.display = unDoneList.style.display = "none";

           //为头部按钮添加点击相应事件
           addEvent(b_all, "click", function() {
               addClass(b_all, "active");
               removeClass(b_done, "active");
               removeClass(b_undone, "active");
               allList.style.display = "block";
               doneList.style.display = unDoneList.style.display = "none";
           });
           addEvent(b_done, "click", function() {
               addClass(b_done, "active");
               removeClass(b_undone, "active");
               removeClass(b_all, "active");
               doneList.style.display = "block";
               allList.style.display = unDoneList.style.display = "none";
           });
           addEvent(b_undone, "click", function() {
               addClass(b_undone, "active");
               removeClass(b_all, "active");
               removeClass(b_done, "active");
               unDoneList.style.display = "block";
               allList.style.display = doneList.style.display = "none";
           });
       }

        function newTask(task) {
            var dateBlock, dateItem;  //任务的日期头
            var tDate = task.date;
            if(date.indexOf(tDate) < 0) {
                date.push(tDate);
                dateItem = document.createElement("dateItem");
                dateBlock = document.createElement("div");
                dateBlock.innerHTML = tDate;
                addClass(dateBlock, "date");
                dateItem.appendChild(dateBlock);
                allList.appendChild(dateItem);
            } else {
                var dates = allList.getElementsByClassName("date");
                for(var i = 0, len = dates.length; i<len; i++) {
                    var that = dates[i];
                    if(that.innerHTML == tDate) {
                        dateBlock = that;
                        dateItem = that.parentNode;
                        break;
                    }
                }
            }

            var taskBlock = document.createElement("div");
            taskBlock.innerHTML = task.tname;
            addClass(taskBlock, "item");
            if(task.finished) {
                addClass(taskBlock, "done");
            }
            dateItem.appendChild(taskBlock);
        }

        //初始化未完成列表
        function initUndone() {
            unDoneList.innerHTML = allList.innerHTML;
            var items = unDoneList.getElementsByClassName("item");
            for(var len = items.length, i = len-1; i >= 0; i--) {
                var that = items[i];
                if(that.classList.contains("done")) {
                    var parent = that.parentNode;
                    parent.removeChild(that);
                    if(parent.children.length == 1) {
                        unDoneList.removeChild(parent);
                    }
                }
            }
        }

        //初始化完成列表
        function initDone() {
            doneList.innerHTML = allList.innerHTML;
            var items = doneList.getElementsByClassName("item");
            for(var len = items.length, i = len-1; i >= 0; i--) {
                var that = items[i];
                if(!that.classList.contains("done")) {
                    var parent = that.parentNode;
                    parent.removeChild(that);
                    if(parent.children.length == 1) {
                        doneList.removeChild(parent);
                    }
                } else {
                    removeClass(that, "done");
                }
            }
        }

    }

    function getData(xhr, text) {
        var file, task, detail, data, length;
        var str = {};
        var text = JSON.parse(text);
        length = text.length;
        var url = xhr.responseURL;
        if (url.indexOf("?") > 0) {
            var search = url.split("?");
            var searchString = decodeURIComponent(search[1]);
            if (searchString.indexOf("&") > 0) {
                searchString = searchString.split("&");
            } else {
                searchString = [searchString];
            }
            for (var i = 0, len = searchString.length; i < len; i++) {
                var sub = searchString[i].split("=");
                var key = sub[0];
                var value = sub[1];
                str[key] = value;
            }
        }

        var num = objLen(str);
        if (num == 0) return;
        for (var k in str) {
            if (!file) {
                for (var i = 0; i < length; i++) {
                    var that = text[i];
                    if (that[k] == str[k]) {
                        file = that.file;
                        break;
                    }
                }
            } else if (!task) {
                var length2 = file.length;
                for(var j = 0; j < length2; j++) {
                    var that = file[j];
                    if(that[k] == str[k]) {
                        task = that.task;
                        break;
                    }
                }
            } else if (!detail) {

            }
        }
        if (file && !task) {
            initSubTC.call(this, file);
        } else if (file && task && !detail) {
            initTask.call(this, task);
        }
    }


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
