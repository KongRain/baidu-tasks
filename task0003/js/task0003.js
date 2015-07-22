/**
 * Created by xyk on 2015/6/15.
 */
(function() {
    var tClass = document.getElementById("task-class");
    var tList = document.getElementById("task-list");
    var tDetail = document.getElementById("task-detail");
    var classList = document.getElementsByClassName("class-list")[0];

    //当前查看的任务路径
    var current = {
        class: "",
        file: "",
        task: ""
    };

    /**
     * json 数据
     *
     * @type: [@class] Array 所有分类
     * @class {
     *           "class": String 分类名称
     *           "file": [@files] Array 下属文件列表
     *         }
     * @files {
     *           "fname": String 文件名
     *           "task": [@tasks] Array 下属任务
     *        }
     * @tasks {
     *          "tname": String 任务名
     *          "date": String 创建时间
     *          "finished": Boolen 是否完成
     *          "detail": String 任务详细说明
     *        }
     */
    var data = [
        {
            "class": "默认分类",
            "file": [
                {
                    "fname": "功能介绍",
                    "task": [
                        {
                            "tname": "使用说明",
                            "date": "2015-07-22",
                            "finished": true,
                            "detail": "此为任务管理器，添加分类，添加文件，添加任务说明"
                        }
                    ]
                }
            ]
        }
    ]

    function createLi (type) {
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

    /**
     * 初始化任务类型列表
     *
     * 点击其中一个任务类型，出现其下属子文件
     */

    function initTC() {
        /*var text = JSON.parse(text);*/
        var list = tClass.getElementsByClassName("class-list")[0];
        var num = data.length;
        for(var i=0; i<num; i++) {
            var name = data[i].class;
            var files = data[i].file;
            var len = files.length;
            var li = createLi("folder");
            var span = li.getElementsByTagName("span")[0];
            span.innerHTML = name + "(" + len + ")";
            list.appendChild(li);
            addEvent(li, "click", clickHandler);
        }

    }

    function clickHandler() {
        var subList = this.getElementsByTagName("ul")[0];

        if(subList) {
            this.removeChild(subList);
        }else {
            var className = this.getElementsByTagName("span")[0].innerHTML;
            className = className.replace(/\s*\(\d+\)$/, "");
            current.class = className;
            var options = {
                class: current.class
            };
            getData.call(this, options);
        }
    }

    /**
     * 初始化子文件列表
     * 点击其中一个子文件，在任务列表内显示出该文件下的任务
     *
     * @param obj 通过Ajax获得的当前任务类型下的子文件对象
     */

    function initSubTC(obj) {
        if(obj) {
            var len = obj.length;
            var ul = document.createElement("ul");
            this.appendChild(ul);
            for(var j=0; j<len; j++) {
                var fileName = obj[j].fname;
                var tasks = obj[j].task;
                var li = createLi("file");
                var span = li.getElementsByTagName("span")[0];
                span.innerHTML = fileName + "(" + tasks.length + ")";
                ul.appendChild(li);
                addEvent(li, "click", subClickHandler);
            }
        }

        function subClickHandler(e) {
            var event = e || window.event;
            if(event.cancelBubble) {
                event.cancelBubble = true;
            } else {
                event.stopPropagation();
            }

            var fileName = this.getElementsByTagName("span")[0].innerHTML;
            fileName = fileName.replace(/\s*\(\d+\)$/, "");
            current.file = fileName;

            var options = {
                class: current.class,
                fname: current.file
            };
            getData.call(this, options);

        }
    }

    /**
     * 初始化任务列表 包括所有、完成、未完成
     * 点击其中一个任务，在任务细节框内显示此任务的内容、创建时间等
     *
     *
     * @param obj 通过Ajax获得的当前子文件下任务对象
     */
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
            addEvent(taskBlock, "click", taskClickHandler);
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
                } else {
                    addEvent(that, "click", taskClickHandler);
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
                    addEvent(that, "click", taskClickHandler);
                }
            }
        }

        function taskClickHandler() {
            var name = this.innerHTML;
            var s_name = tDetail.getElementsByClassName("task-name")[0];
            s_name.innerHTML = name;
            var body = tDetail.getElementsByClassName("detail")[0];
            body.style.display = "block";
            current.task = name;
            var options = {
                class: current.class,
                fname: current.file,
                tname: current.task
            };
            getData.call(this, options);
        }
    }

    /**
     * 初始化任务细节框
     *
     * @param obj 通过Ajax获得的当前任务对象
     */

    function initDetail(obj) {
        var s_date = tDetail.getElementsByClassName("date")[0];
        s_date.innerHTML = "任务时间：" + obj.date;
        var s_detail = tDetail.getElementsByClassName("detail-body")[0].getElementsByTagName("p")[0];
        s_detail.innerHTML = obj.detail;
    }

    /**
     * Ajax "GET"方式 处理函数，获得整体的json对象
     * 根据查询字符串的不同再分别调用各自的处理函数
     * @param options Object 查询对象
     *        {
     *            class: className,
     *            file: fileName,
     *            task: taskName
     *        }
     */
    function getData(options) {
        var file, task, detail, length = data.length;

        var num = objLen(options);
        if (num == 0) return;
        for (var k in options) {
            if (!file) {
                for (var i = 0; i < length; i++) {
                    var that = data[i];
                    if (that[k] == options[k]) {
                        file = that.file;
                        break;
                    }
                }
            } else if (!task) {
                var length2 = file.length;
                for(var j = 0; j < length2; j++) {
                    var that = file[j];
                    if(that[k] == options[k]) {
                        task = that.task;
                        break;
                    }
                }
            } else if (!detail) {
                var length3 = task.length;
                for(var i = 0; i < length3; i++) {
                    var that = task[i];
                    if(that[k] == options[k]) {
                        detail = that;
                        break;
                    }
                }
            }
        }
        if (file && !task) {
            initSubTC.call(this, file);
        } else if (file && task && !detail) {
            initTask.call(this, task);
        } else if(file && task && detail) {
            initDetail.call(this, detail);
        }
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

    /**
     * Ajax提交数据，修改JSON
     */
    /*function newClass() {
        var list = tClass.getElementsByClassName("class-list")[0];
        var className = prompt("请输入任务名称", "");
        if(className != null && className != "") {
            var options = {
                type: "POST",
                data: {
                    class: className
                },
                onsuccess: postData,
                onfail: failHandler
            }
            ajax("file_data.json", options);

            var li = createLi("folder");
            var span = li.getElementsByTagName("span")[0];
            span.innerHTML = className + "(0)";
            list.appendChild(li);
            addEvent(li, "click", clickHandler);
        }
    }

    function postData(xhr, text) {
        var text = JSON.parse(text);
    }*/

    window.onload = function() {
        initTC();
        addEvent(classList, "mouseover", function(e) {
            onMouseEnter(e);
        });
        addEvent(classList, "mouseout", function(e) {
            onMouseLeave(e);
        });
        var b_add = document.getElementsByClassName("addition"),
            b_addClass = b_add[0],
            b_addTask = b_add[1];

        /*addEvent(b_addClass, "click", newClass);*/
    }

})();
