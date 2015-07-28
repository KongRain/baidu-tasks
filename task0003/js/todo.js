
/**
 * ================================= 最外层窗口类 Main ===================================
 */

function Main() {
    this.klasses = [];      //包含的一级任务分类 每个元素均为一级任务类Klass
    this.sum = 1;         //总任务数量
    this.currentKlass = null;    //当前窗口的一级任务
    this.init();
}

Main.prototype = {
    constructor: Main,

    addKlass: function(klass) {
        this.klasses.push(klass);
        klass.show();
        klass.init();         //为klass绑定事件
        this.setCurrentKlass(klass);
    },

    removeKlass: function(klass) {
        var klasses = this.klasses;
        var index = klasses.indexOf(klass);
        if(index == -1) return;
        else {
            klasses.splice(index, 1);
            $('.class-list').removeChild(klass.ui);    //在页面中删除DOM元素
        }
    },

    /*通过一级任务名称找到相应的对象*/
    getKlass: function(klassName) {
        var klasses = this.klasses;
        for(var i=0, len=klasses.length; i<len; i++) {
            if(klasses[i].name == klassName) {
                return klasses[i];
            }
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
    },

    setCurrentKlass: function(klass) {
        this.currentKlass = klass;
    },

    init: function() {
        this.addKlass(dftKlass);
        dftKlass.addFile(dftFile);
        dftFile.addTask(dftTask);
        dftTask.showDetail();
        this.eventDelegate();
        this.cilckDelete();
    },

    /*一级任务点击事件代理*/
    eventDelegate: function() {
        var that = this;
        addEvent($('.class-list'), 'click', function(e) {
            var target = getTarget(e);
            var targetTag = target.tagName.toLowerCase();
            while(targetTag != 'h3' && targetTag != 'h4') {
                target = target.parentNode;
                targetTag = target.tagName.toLowerCase();
            }
            if(targetTag == 'h4') return;

            var klassName = target.getElementsByTagName("span")[0].innerHTML;
            klassName = klassName.replace(/\s*\(\d+\)$/, "");
            var currentKlass = that.getKlass(klassName);
            that.setCurrentKlass(currentKlass);     //设置当前文件
            currentKlass.toggle();
        });

    },

    /*点击删除图标删除此分类（一级分类）*/
    cilckDelete: function() {
        var that = this;

        addEvent($('.class-list'), 'click', function(e) {
            var event = e || window.event;
            var target = getTarget(e);
            if(hasClass(target, 'delete') && target.parentNode.nodeName.toLowerCase() == 'h3') {
                if(event.cancelBubble) {
                    event.cancelBubble = true;
                } else {
                    event.stopPropagation();
                }
                var answer = confirm('确定删除此分类？');
                if(answer) {
                    var klassName = target.parentNode.getElementsByTagName('span')[0].innerHTML;
                    klassName = klassName.replace(/\s*\(\d+\)$/, "");
                    var klass = that.getKlass(klassName);
                    that.removeKlass(klass);
                }
            }

        });
    },
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
        /*this.ui.appendChild(file.ui);   //在页面中添加DOM元素*/
        //显示这个文件
        var fileUI = file.createUI();
        var subList = this.ui.getElementsByTagName('ul')[0];
        if(subList) {
            subList.appendChild(fileUI);
        } else {
            var newList = document.createElement('ul');
            newList.appendChild(fileUI);
            this.ui.appendChild(newList);
        }
        this.setCurrentFile(file);
        this.updateLength();
        file.init();
    },

    updateLength: function() {
        var span = this.ui.getElementsByTagName('span')[0];
        span.innerHTML = this.name + '(' + this.files.length + ')';
    },

    /*删除二级子任务*/
    removeFile: function(file) {
        var files = this.files;
        var index = files.indexOf(file);
        if(index == -1) return;
        else {
            files.splice(index, 1);
            this.ui.getElementsByTagName('ul')[0].removeChild(file.ui);    //在页面中删除DOM元素
            this.updateLength();
        }
    },

    /*点击时出现或隐藏二级任务*/
    toggle: function() {
        if(this.files.length == 0) return;

        var subList = this.ui.getElementsByTagName('ul')[0];

        if(subList) {
            /*this.ui.removeChild(subList);*/
            if(subList.style.display == 'block') {
                subList.style.display = 'none';
            } else {
                subList.style.display = 'block';
            }
        } else {
            var ul = document.createElement("ul");
            this.ui.appendChild(ul);
            this.files.forEach(function(file) {
                ul.appendChild(file.createUI());
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
        var h;
        if(type == 'folder') {
            h = document.createElement("h3");
        } else {
            h = document.createElement('h4');
        }
        var i = document.createElement("i");
        var span = document.createElement("span");
        var deleteIcon = document.createElement('i');
        deleteIcon.className = 'icon delete';
        addClass(i, "icon");
        addClass(i, type);
        h.appendChild(i);
        h.appendChild(span);
        h.appendChild(deleteIcon);
        li.appendChild(h);
        return li;
    },

    /*二级任务点击事件代理*/
    clickEventDelegate: function() {
        var that = this;
        addEvent($('.class-list'), 'click', function(e) {
            var event = e || window.event;
            var target = getTarget(event);
            var targetTag = target.tagName.toLowerCase();
            while(targetTag != 'h3' && targetTag != 'h4') {
                target = target.parentNode;
                targetTag = target.tagName.toLowerCase();
            }
            if(targetTag == 'h3') return;

            //取消冒泡
            if(event.cancelBubble) {
                event.cancelBubble;
            } else {
                event.stopPropagation();
            }
            var fileName = target.getElementsByTagName("span")[0].innerHTML;
            fileName = fileName.replace(/\s*\(\d+\)$/, "");
            var currentFile = that.getFile(fileName);
            if(!currentFile) return;
            that.setCurrentFile(currentFile);     //设置当前文件
            currentFile.showTasks();
        });
    },

    /*鼠标进入出现删除图标*/
    enterEventDelegate: function() {
        addEvent(this.ui, 'mouseover', this.showIcon);
    },

    /*鼠标移出隐藏删除图标*/
    leaveEventDelegate: function() {
        addEvent(this.ui, 'mouseout', this.hintIcon);
    },

    showIcon: function() {
        var deleteIcon = this.getElementsByClassName('delete')[0];
        deleteIcon.style.display = 'inline-block';
    },

    hintIcon: function() {
        var deleteIcon = this.getElementsByClassName('delete')[0];
        deleteIcon.style.display = 'none';
    },

    removeMouseEvent: function() {
        removeEvent(this.ui, 'mouseover', this.showIcon);
        removeEvent(this.ui, 'mouseout',this.hintIcon);
    },

    /*点击删除图标删除此文件（二级分类）*/
    cilckDelete: function() {
        var that = this;
        //var deleteIcon = this.getElementsByClassName('delete')[0];
        addEvent(this.ui, 'click', function(e) {
            var event = e || window.event;
            var target = getTarget(e);
            if(hasClass(target, 'delete') && target.parentNode.nodeName.toLowerCase() == 'h4') {
                if(event.cancelBubble) {
                    event.cancelBubble = true;
                } else {
                    event.stopPropagation();
                }
                var answer = confirm('确定删除此分类？');
                if(answer) {
                    var fileName = target.parentNode.getElementsByTagName('span')[0].innerHTML;
                    fileName = fileName.replace(/\s*\(\d+\)$/, "");
                    var file = that.getFile(fileName);
                    that.removeFile(file);
                }
            }

        });
    },

    init: function() {
        this.clickEventDelegate();
        this.enterEventDelegate();
        this.leaveEventDelegate();
        this.cilckDelete();
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
    createUI: function() {
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
        task.init();
        this.list.updateBoth();
        this.currentTask = task;
        this.updateLength();
    },

    /*删除该对象的某个三级任务 !待改! */
    removeTask: function(task) {
        var tasks = this.tasks;
        var index = tasks.indexOf(task);

        if(index == -1) return;
        else {
            tasks.splice(index+1, 1);
            this.list.deleteTask(task);
        }
    },

    updateLength: function() {
        var span = this.ui.getElementsByTagName('span')[0];
        span.innerHTML = this.name + '(' + this.tasks.length + ')';
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
        var that = this;
        this.list.clear();
        this.list.dates = [];
        this.tasks.forEach(function(task) {
            that.list.showTask(task);
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
        var h;
        if(type == 'folder') {
            h = document.createElement("h3");
        } else {
            h = document.createElement('h4');
        }
        var i = document.createElement("i");
        var span = document.createElement("span");
        var deleteIcon = document.createElement('i');
        deleteIcon.className = 'icon delete';
        addClass(i, "icon");
        addClass(i, type);
        h.appendChild(i);
        h.appendChild(span);
        h.appendChild(deleteIcon);
        li.appendChild(h);
        return li;
    },

    /*鼠标进入出现删除图标*/
    enterEventDelegate: function() {
        addEvent(this.ui, 'mouseover', this.showIcon);
    },

    /*鼠标移出隐藏删除图标*/
    leaveEventDelegate: function() {
        addEvent(this.ui, 'mouseout',this.hintIcon);
    },

    showIcon: function(e) {
        var event = e || window.event;
        if(event.cancelBubble) {
            event.cancelBubble = true;
        } else {
            event.stopPropagation();
        }
        var deleteIcon = this.getElementsByClassName('delete')[0];
        deleteIcon.style.display = 'inline-block';
    },

    hintIcon: function(e) {
        var event = e || window.event;
        if(event.cancelBubble) {
            event.cancelBubble = true;
        } else {
            event.stopPropagation();
        }
        var deleteIcon = this.getElementsByClassName('delete')[0];
        deleteIcon.style.display = 'none';
    },

    removeMouseEvent: function() {
        removeEvent(this.ui, 'mouseover', this.showIcon);
        removeEvent(this.ui, 'mouseout',this.hintIcon);
    },

    init: function() {
        this.enterEventDelegate();
        this.leaveEventDelegate();
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
        $('.edit-submit').style.display = 'none';
        if(this.finished) {
            $('.detail-head .ok').style.display = 'none';
            $('.detail-head .edit').style.display = 'none';
        } else {
            $('.detail-head .ok').style.display = 'inline-block';
            $('.detail-head .edit').style.display = 'inline-block';
        }
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

        var editDetail = '<textarea class="input-detail" ';
        if(this.detail) {
            editDetail += '>' + this.detail + '</textarea>';
        }else {
            editDetail += 'palceholder="请输入任务内容"></textarea>';
        }
        $('.detail-body').innerHTML = editDetail;
        $('.edit-submit').style.display = 'block';
    },

    /*提交编辑信息*/
    submitEdit: function() {
        var name = $('.input-name').value,
            date = $('.input-date').value,
            detail = $('.input-detail').value;

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
    },

    clickHandler: function() {
        var that = this;
        addEvent(this.ui, 'click', function() {
            that.showDetail();
        });
    },

    init: function() {
        this.clickHandler();
    }

}

/**
 *====================================== 三级任务列表类 List ===========================
 */
//这个类只负责显示三级任务 包括日期聚类，在列表中新建任务的显示等
function List() {
    //this.tasks = tasks;            //对应的全部三级任务
    this.allList = $('.all');         //全部列表
    this.doneList = $('.finish');           //已完成列表
    this.undoneList = $('.unFinish');        //未完成列表
    this.dates = [];                //列表中已包含的日期
    this.switchHandler();
}

List.prototype = {
    constructor: List,

    /*在列表里显示一个任务task*/
    showTask: function (task) {
        var date = task.date;
        var dateItem;         //任务对应的日期div
        if (this.dates.indexOf(date) < 0) {
            this.dates.push(date);
            dateItem = this.createDateItem(date);
        } else {
            dateItem = this.searchDateItem(date);
        }
        var taskBlock = document.createElement("div");
        taskBlock.innerHTML = task.name;
        addClass(taskBlock, "item");
        if (task.finished) {
            addClass(taskBlock, "done");
        }
        dateItem.appendChild(taskBlock);
        task.setUI(taskBlock);              //为task绑定DOM元素
        task.init();
    },

    /*创建新的日期div 内部*/
    createDateItem: function (date) {
        var dateItem = document.createElement("div");
        var dateBlock = document.createElement("div");
        dateBlock.innerHTML = date;
        addClass(dateItem, 'dateItem');
        addClass(dateBlock, 'date');
        dateItem.appendChild(dateBlock);
        this.allList.appendChild(dateItem);         //在界面中显示
        return dateItem;
    },

    /*查找date对应的div 内部*/
    searchDateItem: function (date) {
        if (this.dates.indexOf(date) == -1) return;

        var dateBlock, dateItem;
        var allList = this.allList;
        var dates = allList.getElementsByClassName("date");
        for (var i = 0, len = dates.length; i < len; i++) {
            if (dates[i].innerHTML == date) {
                dateBlock = dates[i];
                dateItem = dates[i].parentNode;
                break;
            }
        }
        return dateItem;
    },

    clear: function () {
        this.allList.innerHTML = '';
        this.doneList.innerHTML  = '';
        this.undoneList.innerHTML  = '';
    },

    /*根据全部类表更新完成和未完成列表*/
    updateBoth: function () {
        this.updateDone();
        this.updateUndone();
    },

    /*根据全部类表更新完成列表 内部*/
    updateDone: function () {
        this.doneList.innerHTML = this.allList.innerHTML;
        var items = this.doneList.getElementsByClassName("item");
        for (var len = items.length, i = len - 1; i >= 0; i--) {
            var that = items[i];
            if (!that.classList.contains("done")) {
                var parent = that.parentNode;
                parent.removeChild(that);
                if (parent.children.length == 1) {
                    this.doneList.removeChild(parent);
                }
            } else {
                removeClass(that, "done");
            }
        }
    },

    /*根据全部类表更新未完成列表 内部*/
    updateUndone: function () {
        this.undoneList.innerHTML = this.allList.innerHTML;
        var items = this.undoneList.getElementsByClassName("item");
        for (var len = items.length, i = len - 1; i >= 0; i--) {
            var that = items[i];
            if (that.classList.contains("done")) {
                var parent = that.parentNode;
                parent.removeChild(that);
                if (parent.children.length == 1) {
                    this.undoneList.removeChild(parent);
                }
            }
        }
    },

    /*切换到要显示的列表 option：all || undone || done*/
    switchTo: function (option) {
        var option = option || 'all';
        var b_all = $('#task-list .b-all'),
            b_undone = $('#task-list .b-undone'),
            b_done = $('#task-list .b-done');

        if (option == 'all') {
            addClass(b_all, "active");
            removeClass(b_done, "active");
            removeClass(b_undone, "active");
            this.allList.style.display = "block";
            this.doneList.style.display = this.undoneList.style.display = "none";
        } else if (option == 'undone') {
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

    deleteTask: function (task) {
        var ui = task.ui;
        var dateItem = ui.parentNode;
        dateItem.removeChild(ui);
        if (dateItem.children.length == 1) {
            dateItem.parentNode.removeChild(dateItem);
            var index = this.dates.indexOf(task.date);
            this.dates.splice(index, 1);
        }
    },

    switchHandler: function() {
        var that = this;
        addEvent($('#task-list ul'), 'click', function(e) {
            var event = e || window.event;
            var target = getTarget(event);
            var cName = target.className;
            /*var option = cName.replace(/^b-/, '');
            that.switchTo(option);*/
            switch (cName) {
                case 'b-all':
                    that.switchTo('all');
                    break;
                case 'b-undone':
                    that.switchTo('undone');
                    break;
                case 'b-done':
                    that.switchTo('done');
                    break;
                default:
                    break;
            }
        });
    }
}

/**
 * ====================================== 全局变量 ================================
 */

/*
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

var dftKlass = new Klass('默认分类');
var dftFile = new File('功能介绍');
var dftTask = new Task('使用说明', '2015-07-22', true, '此为任务管理器，添加分类，添加文件，添加任务说明');
var main = new Main();
dftKlass.removeMouseEvent();
dftFile.removeMouseEvent();

/**
 * ===================================== 新建分类 ===========================================
 */

/*点击新建任务按钮*/
addEvent($('#task-class .addition'),'click', function() {
    $('#prompt').style.display = 'block';
});

/*点击确定按钮*/
addEvent($('#prompt .sure'), 'click', function() {
    var type = $('#select-class').value;
    var name = $('#class-name').value;
    if(name == '') {
        alert('请填写任务名称');
    }
    if(type == 'parent') {
        var newKlass = new Klass(name);
        main.addKlass(newKlass);
    } else {
        var newFile = new File(name);
        main.currentKlass.addFile(newFile);
        newFile.showTasks();
    }
    $('#prompt').style.display = 'none';
    $('#class-name').value = '';
    $('#select-class').value = 'parent';
});

/*点击取消按钮*/
addEvent($('#prompt .cancel'), 'click', function() {
    $('#prompt').style.display = 'none';
    $('#class-name').value = '';
    $('#select-class').value = 'parent';
});

/**
 * ================================= 新建任务 =================================
 */

/*点击新建任务按钮*/
addEvent($('#task-list .addition'), 'click', function() {
    var currentFile = main.currentKlass.currentFile;
    if(!currentFile) {
        alert('请先创建子分类');
        return;
    } else {
        var newTask = new Task('', '', true, '');
        $('.detail-head .ok').style.display = 'none';
        $('.detail-head .edit').style.display = 'none';
        newTask.edit();
    }
});

/*点击保存按钮*/
addEvent($('.edit-submit .save'), 'click', function() {
    var currentFile = main.currentKlass.currentFile;
    var currentTask = currentFile.currentTask;

    // 通过编辑按钮是否隐藏来判断当前操作是编辑任务还是新建任务
    if($('.detail-head .ok').style.display == 'inline-block') {
        /*var newTask = new Task(newName, newDate, false, newDetail);*/
        currentFile.removeTask(currentTask);
    }

    var newTask = new Task('', '', false, '');
    newTask.submitEdit();
    currentFile.addTask(newTask);
    newTask.showDetail();
});

/*点击取消按钮*/
addEvent($('.edit-submit .cancel'), 'click', function() {
    var currentFile = main.currentKlass.currentFile;
    var currentTask = currentFile.currentTask;
    if(currentTask) {
        currentTask.showDetail();
    }else{
        var task = new Task('', '', true, '');
        task.showDetail();
    }
});

/**
 * ===================================== 编辑任务 ===================================
 */
/*点击编辑或完成按钮*/
addEvent($('.detail-head'), 'click', function(e) {
    var target = getTarget(e);
    var cName = target.className;
    var currentFile = main.currentKlass.currentFile;
    var currentTask = currentFile.currentTask;
    switch (cName) {
        case 'icon ok':
            currentTask.finishTask();
            currentFile.list.updateBoth();
            break;
        case 'icon edit':
            currentTask.edit();
            break;
        default :
            break;
    }
});
