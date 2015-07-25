
/*全局变量current 保存当前选择的类别、文件、任务ID*/
var currentKlass = {
    'class': '默认分类',
    'fname': '功能介绍',
    'tname': '使用说明'
};
//总任务数量
var sum = 0;

/**
 * ========================= 数据结构 ===========================
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
];
/**
 * ======================== 数据查找 ==========================
 */

/**
 * 获得分类
 * @param className {String}  类别名称
 * @return found {Object}  根据名称找到对应的类别对象
 */
function getClass(className) {
    var className = className || current.class;
    var len = data.length;
    var found;

    for(var i= 0; i<len; i++) {
        if(data[i].class == className) {
            found  = data[i];
            break;
        }
    }
    return found;
}

/**
 * 获得文件
 * @param className {String} 类别名称
 * @param fileName {String}  文件名称
 * @return found {Object}  根据名称找到对应的文件对象
 */
function getFile(className, fileName) {
    var className = className || current.class,
        fileName = fileName || current.fname;
    var theClass = getClass(className);
    var len = theClass.file.length;
    var found;

    for(var i=0; i<len; i++) {
        if(theClass.file[i].fname == fileName) {
            found = theClass.file[i];
            break;
        }
    }
    return found;
}

/**
 * 获得任务文件
 *@param className {String} 类别名称
 *@param fileName {String}  文件名称
 *@param taskName {String}  任务名称
 *@return found {Object}  根据名称找到对应的任务对象
 */
function getTask(className, fileName, taskName) {
    var className = className || current.class,
        fileName = fileName || current.fname,
        taskName = taskName || current.tname;
    var theFile = getFile(className, fileName);
    var len = theFile.task.length;
    var found;

    for(var i=0; i<len; i++) {
        if(theFile.task[i].tname == taskName) {
            found = theFile.task[i];
            break;
        }
    }
    return found;
}

/**
 * ======================== 数据呈现 ===========================
 */

//全局初始化
function init() {
    initClass();
    initTask();
    initDetail();
    setCurrent();
}

//分类栏初始化
function initClass(){
    showAllClass();
    setSum();
    delegateClickEvent();
    delegateMouseEvent();
}


//任务栏初始化
function initTask() {

}

//细节栏初始化
function initDetail() {

}

//将当前任务用高亮标记出来
function setCurrent() {

}

function showAllClass() {
    var len = data.length;
    var list = $("#task-class .class-list");
    if(!list) {
        console.log('list search failed.');
    }
    for(var i=0; i<len; i++) {
        var name = data[i].class;
        var files = data[i].file;
        var length = files.length;
        var li = createLi("folder");
        var span = li.getElementsByTagName("span")[0];
        span.innerHTML = name + "(" + length + ")";
        list.appendChild(li);
        //addEvent(li, "click", clickHandler);
    }

}
/**
 * ================================= 最外层窗口类 Main ===================================
 */

function Main() {
    this.klasses = [];      //包含的一级任务分类 每个元素均为一级任务类Klass
    this.sum = 1;         //总任务数量
}

Main.prototype = {
    constructor: Main,

    addKlass: function(klass) {
        this.klasses.push(klass);
        klass.show();
    },

    removeKlass: function(klass) {
        var klasses = this.klasses;
        var index = klasses.indexOf(klass);
        if(index == -1) return;
        else {
            klasses.splice(index+1, 1);
            $('.class-list').removeChild(klass.ui);    //在页面中删除DOM元素
        }
    },

    getSum: function() {
        var num;
        this.klasses.forEach(function(klass) {
            klass.files.forEach(function(file) {
                num += file.tasks.length;
            });
        });
        return num;
    }
}


/**
 * ================================= 一级任务类 Klass ===================================
 */

function Klass(name) {
    this.name = name;
    this.files = [];     //包含的二级子任务 每个元素均为二级任务类File
    this.ui = null;      //在ui中绑定的DOM元素
    this.currentFile = null;      //当前操作的二级文件
}

Klass.prototype = {
    constructor: Klass,

    /*在页面中显示*/
    show: function() {
        var list = $('#task-class .class-list');
        var li = this.createLi('folder');
        this.setUI(li);
        var span = li.getElementsByTagName('span')[0];
        span.innerHTML = this.name + '(' + this.files.length + ')';
        list.appendChild(li);
    },

    /*为此对象绑定DOM元素*/
    setUI: function(ui) {
        this.ui = ui;
    },

    /*设置当前二级任务*/
    setCurrentFile: function(file) {
        this.currentFile = file;
    },

    /*添加二级子任务*/
    addFile: function(file) {
        this.files.push(file);
        this.ui.appendChild(file.ui);   //在页面中添加DOM元素
    },

    /*删除二级子任务*/
    removeFile: function(file) {
        var files = this.files;
        var index = files.indexOf(file);
        if(index == -1) return;
        else {
            files.splice(index+1, 1);
            this.ui.removeChild(file.ui);    //在页面中删除DOM元素
        }
    },

    /*点击时出现或隐藏二级任务*/
    toggle: function() {
        if(this.files.length == 0) return;

        var subList = this.ui.getElementsByTagName('ul')[0];

        if(subList) {
            this.removeChild(subList);
        } else {
            var ul = document.createElement("ul");
            this.ui.appendChild(ul);
            this.files.forEach(function(file) {
                ul.appendChild(file.show());
            });
        }
    },

    /*通过二级任务名称查找对应的对象*/
    getFile: function(fileName) {
        var files = this.files;
        for(var i=0, len=files.length; i<len; i++) {
            if(files[i].name == fileName) {
                return files[i];
            }
        }
    },

    /*高光选中此对象*/
    highLight: function() {
        addClass(this.ui, 'active');
    },

    /*取消高光*/
    unHighLight: function() {
        removeClass(this.ui, 'active');
    },

    /*创建界面的DOM元素*/
    createLi: function (type) {
        var type = type ? type : "folder";
        var li = document.createElement("li");
        var h3 = document.createElement("h3");
        var i = document.createElement("i");
        var span = document.createElement("span");
        addClass(i, "icon");
        addClass(i, type);
        h3.appendChild(i);
        h3.appendChild(span);
        li.appendChild(h3);
        return li;
    }
}

/**
 * ===================================== 二级任务类 File ==============================
 */

function File(name) {
    this.name = name;
    this.tasks = [];      //包含的三级子任务 每个元素均为三级任务类Task
    this.ui = null;       //在ui中绑定的DOM元素
    this.list = new List();     //包含的三级子任务对应的任务表 为List类
    this.currentTask = null;
}

File.prototype = {
    constructor: File,

    /*创建该对象的DOM元素，并返回这个DOM元素*/
    show: function() {
        var li = this.createLi('file');
        this.setUI(li);
        var span = li.getElementsByTagName('span')[0];
        span.innerHTML = this.name + '(' + this.tasks.length + ')';
        return li;
    },

    /*为该对象绑定DOM元素*/
    setUI: function(ui) {
        this.ui = ui;
    },

    /*设置当前的三级任务*/
    setCurrentTask: function(task) {
        this.currentFile = task;
    },

    /*为该对象添加三级任务*/
    addTask: function(task) {
        this.tasks.push(task);
        this.list.showTask(task);
        this.list.updateBoth();
    },

    /*/!*删除该对象的某个三级任务 !待改! *!/
    removeTask: function(task) {
        var tasks = this.tasks;
        var index = tasks.indexOf(task);

        if(index == -1) return;
        else {
            tasks.splice(index+1, 1);
            //待添加在界面中删除这个任务
            //...
        }
    },*/

    /*根据三级任务的名字查找对应对象*/
    getTask: function(taskName) {
        var tasks = this.tasks;
        for(var i=0, len=tasks.length; i<len; i++) {
            if(tasks[i].name == taskName) {
                return tasks[i];
            }
        }
    },

    /*显示其包含的所有三级任务*/
    showTasks: function() {
        this.list.clear();
        this.tasks.forEach(function(task) {
            this.list.showTask(task);
        });
        this.list.switchTo('all');
        this.list.updateBoth();
    },

    /*高光选中此对象*/
    highLight: function() {
        addClass(this.ui, 'active');
    },

    /*取消高光*/
    unHighLight: function() {
        removeClass(this.ui, 'active');
    },

    /*创建界面的DOM元素*/
    createLi: function (type) {
        var type = type ? type : "folder";
        var li = document.createElement("li");
        var h3 = document.createElement("h3");
        var i = document.createElement("i");
        var span = document.createElement("span");
        addClass(i, "icon");
        addClass(i, type);
        h3.appendChild(i);
        h3.appendChild(span);
        li.appendChild(h3);
        return li;
    }
}

/**
 *====================================== 三级任务类 Task ==================================
 */

function Task(name, date, finished, detail) {
    this.name = name;
    this.date = date;
    this.finished = finished;
    this.detail = detail;
    this.ui = null;        //在ui的全部列表中绑定的DOM元素
    /*this.list = new List();   //对应的list列表*/
}

Task.prototype = {
    constructor: Task,

    setName: function(name) {
        if(typeof name != 'string') return;
        else {
        this.name = name;
        }
    },

    setDate: function(date) {
        if(typeof date != 'string') return;
        else {
            this.date = date;
        }
    },

    setFinished: function(finished) {
        if(typeof finished != 'boolean') return;
        else {
            this.finished = finished;
        }
    },

    setDetail: function(detail) {
        if(typeof detail != 'string') return;
        else {
            this.detail = detail;
        }
    },

    setUI: function(ui) {
        this.ui = ui;
    },

    showDetail: function() {
        $('.task-name').innerHTML = this.name;
        $('.task-date').innerHTML = this.date;
        $('.detail-body').innerHTML = this.detail;
    },

    /*编辑的界面*/
    edit: function() {
        var editName = '<input class="input-name" type="text" ';
        if(this.name) {
            editName += 'value=' + this.name;
        } else {
            editName += 'placeholder="请输入任务名称"';
        }
        editName += ' />';
        $('.task-name').innerHTML = editName;

        var editDate = '<input class="input-date" type=';
        if(this.date) {
            editDate += '"text" value=' + this.date;
        }else {
            editDate += '"date"';
        }
        editDate += ' />';
        $('.task-date').innerHTML = editDate;

        var editDetail = '<textarea class="input-detail "';
        if(this.detail) {
            editDetail += '>' + this.detail + '</textarea>';
        }else {
            editDetail += 'palceholder="请输入任务内容"></textarea>';
        }
        $('.detail-boty').innerHTML = editDetail;
    },

    /*提交编辑信息*/
    submitEdit: function() {
        var name = $('.input-name').value,
            date = $('.input-date').value,
            detail = $('.input-detail').innerHTML;

        if(name == '') {
            alert('请输入任务名称');
        }
        if(date == '') {
            alert('请输入日期');
        }
        this.name = name;
        this.date = date;
        this.detail = detail;
        //currentKlass.currentFile.list.showTask(this);
    },

    /*点击任务的完成按钮*/
    finishTask: function() {
        this.finished = true;
        addClass(this.ui, 'done');
    }

}

/**
 *====================================== 三级任务列表类 List ===========================
 */
//这个类只负责显示三级任务 包括日期聚类，在列表中新建任务的显示等
function List() {
    //this.tasks = tasks;            //对应的全部三级任务
    this.allList = $('.all');         //全部列表
    this.doneList = $('.undone');           //已完成列表
    this.undoneList = $('.done');        //未完成列表
    this.dates = [];                //列表中已包含的日期
}

List.prototype = {
    constructor: List,

    /*在列表里显示一个任务task*/
    showTask: function(task) {
        var date = task.date;
        var dateItem;         //任务对应的日期div
        if(date.indexOf(date) < 0) {
            this.dates.push(date);
            dateItem = this.createDateItem(date);
        } else {
            dateItem = this.searchDateItem(date);
        }
        var taskBlock = document.createElement("div");
        taskBlock.innerHTML = task.tname;
        addClass(taskBlock, "item");
        if(task.finished) {
            addClass(taskBlock, "done");
        }
        dateItem.appendChild(taskBlock);
        task.setUI(taskBlock);              //为task绑定DOM元素
    },

    /*创建新的日期div 内部*/
    createDateItem: function(date) {
        var dateItem = document.createElement("div");
        var dateBlock = document.createElement("div");
        dateBlock.innerHTML = date;
        addClass(dateItem, 'dateItem');
        addClass(dateBlock, 'date');
        dateItem.appendChild(dateBlock);
        return dateItem;
    },

    /*查找date对应的div 内部*/
    searchDateItem: function(date) {
        if(this.dates.indexOf(date) == -1) return;

        var dateBlock, dateItem;
        var allList = this.allList;
        var dates = allList.getElementsByClassName("date");
        for(var i = 0, len = dates.length; i<len; i++) {
            if(dates[i].innerHTML == date) {
                dateBlock = dates[i];
                dateItem = dates[i].parentNode;
                break;
            }
        }
        return dateItem;
    },

    clear: function() {
        this.allList = '';
        this.doneList = '';
        this.undoneList = '';
    },

    /*根据全部类表更新完成和未完成列表*/
    updateBoth: function() {
        this.updateDone();
        this.updateUndone();
    },

    /*根据全部类表更新完成列表 内部*/
    updateDone: function() {
        this.doneList.innerHTML = this.allList.innerHTML;
        var items = this.doneList.getElementsByClassName("item");
        for(var len = items.length, i = len-1; i >= 0; i--) {
            var that = items[i];
            if(!that.classList.contains("done")) {
                var parent = that.parentNode;
                parent.removeChild(that);
                if(parent.children.length == 1) {
                    this.doneList.removeChild(parent);
                }
            } else {
                removeClass(that, "done");
            }
        }
    },

    /*根据全部类表更新未完成列表 内部*/
    updateUndone: function() {
        this.undoneList.innerHTML = this.allList.innerHTML;
        var items = this.undoneList.getElementsByClassName("item");
        for(var len = items.length, i = len-1; i >= 0; i--) {
            var that = items[i];
            if(that.classList.contains("done")) {
                var parent = that.parentNode;
                parent.removeChild(that);
                if(parent.children.length == 1) {
                    this.undoneList.removeChild(parent);
                }
            }
        }
    },

    /*切换到要显示的列表 option：all || undone || done*/
    switchTo: function(option) {
        var option = option || 'all';
        var b_all = $('#task-list .b-all'),
            b_undone = $('#task-list .b-undone'),
            b_done = $('#task-list .b-done');

        if(option == 'all') {
            addClass(b_all, "active");
            removeClass(b_done, "active");
            removeClass(b_undone, "active");
            this.allList.style.display = "block";
            this.doneList.style.display = this.undoneList.style.display = "none";
        } else if(option == 'undone') {
            addClass(b_undone, "active");
            removeClass(b_all, "active");
            removeClass(b_done, "active");
            this.undoneList.style.display = "block";
            this.allList.style.display = this.doneList.style.display = "none";
        } else {
            addClass(b_done, "active");
            removeClass(b_undone, "active");
            removeClass(b_all, "active");
            this.doneList.style.display = "block";
            this.allList.style.display = this.undoneList.style.display = "none";
        }
    },

    deleteTask: function(task) {
        var ui = task.ui;
        var dateItem = ui.parentNode;
        dateItem.removeChild(ui);
        if(dateItem.children.length == 1) {
            dateItem.parentNode.removeChild(dateItem);
        }
    }

}