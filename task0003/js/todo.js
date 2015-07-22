
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
    for(var i=0; i<len; i++) {
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