
/*全局变量current 保存当前选择的类别、文件、任务ID*/
var current = {
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
    var list = $("#task-class .class-list")[0];
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

function createLi (type) {
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

/**
 * ================================= 一级任务类 Klass ===================================
 */

function Klass(name) {
    this.name = name;
    this.files = [];     //包含的二级子任务 每个元素均为二级任务类File
    this.ui = null;      //在ui中绑定的DOM元素
}

Klass.prototype = {
    constructor: Klass,

    /*在页面中显示*/
    show: function() {
        var list = $('#task-class .class-list')[0];
        var li = createLi('folder');
        this.setUI(li);
        var span = li.getElementsByTagName('span')[0];
        span.innerHTML = this.name + '(' + this.files.length + ')';
        list.appendChild(li);
    },

    /*为此对象绑定DOM元素*/
    setUI: function(ui) {
        this.ui = ui;
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
    }
}

/**
 * ===================================== 二级任务类 File ==============================
 */

function File(name) {
    this.name = name;
    this.tasks = [];      //包含的三级子任务 每个元素均为三级任务类Task
    this.ui = null;       //在ui中绑定的DOM元素
}

File.prototype = {
    constructor: File,

    /*创建该对象的DOM元素，并返回这个DOM元素*/
    show: function() {
        var li = createLi('file');
        this.setUI(li);
        var span = li.getElementsByTagName('span')[0];
        span.innerHTML = this.name + '(' + this.tasks.length + ')';
        return li;
    },

    /*为该对象绑定DOM元素*/
    setUI: function(ui) {
        this.ui = ui;
    },

    /*为该对象添加三级任务*/
    addTask: function(task) {
        this.tasks.push(task);
        task.show();
    },

    /*删除该对象的某个三级任务*/
    removeTask: function(task) {
        var tasks = this.tasks;
        var index = tasks.indexOf(task);

        if(index == -1) return;
        else {
            tasks.splice(index+1, 1);
            //待添加在界面中删除这个任务
            //...
        }
    },

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
        this.tasks.forEach(function(task) {
            task.show();
        });
    },

    /*高光选中此对象*/
    highLight: function() {
        addClass(this.ui, 'active');
    },

    /*取消高光*/
    unHighLight: function() {
        removeClass(this.ui, 'active');
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

    show: function() {}
}