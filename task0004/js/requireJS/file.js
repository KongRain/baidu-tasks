console.log('file加载成功');

define(['util','list'], function(_, list) {

	function File(name, id) {
		this.id = id;
	    this.name = name;
	    this.tasks = [];      //包含的三级子任务 每个元素均为三级任务类Task
	    this.ui = null;       //在ui中绑定的DOM元素
	    this.list = new list.List();     //包含的三级子任务对应的任务表 为List类
	    this.currentTask = null;
	    this.parent = null;     //它的父类 也就是Klass
	}

	File.prototype = {
	    constructor: File,

	    /*创建该对象的DOM元素，并返回这个DOM元素*/
	    createUI: function() {
	        var li = this.createLi('file');
	        this.setUI(li);
	        var h4 = li.getElementsByTagName('h4')[0];
	        var textNode = document.createTextNode(this.name + '(' + this.tasks.length + ')');
	        h4.appendChild(textNode);
	        
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

	    /*设置它的父类*/
	    setParent: function(pa) {
	        this.parent = pa;
	    },

	    /*为该对象添加三级任务*/
	    addTask: function(task) {
	        this.tasks.push(task);
	        this.list.showTask(task);
	        task.init();
	        this.list.updateBoth();
	        this.currentTask = task;
	        this.updateLength();
	        task.setParent(this);
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
	        var h4 = this.ui.getElementsByTagName('h4')[0];
	        h4.lastChild.nodeValue = this.name + '(' + this.tasks.length + ')';
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

	    /*根据三级任务的id查找对应对象*/
	    getTaskById: function(id) {
	        var tasks = this.tasks;
	        for(var i=0, len=tasks.length; i<len; i++) {
	            if(tasks[i].id == id) {
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
	        _.addClass(this.ui.getElementsByTagName('h4')[0], 'active');
	    },

	    /*取消高光*/
	    unHighLight: function() {
	        _.removeClass(this.ui.getElementsByTagName('h4')[0], 'active');
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
	        var deleteIcon = document.createElement("i");
	        deleteIcon.className = 'fa fa-close';
	        _.addClass(h, type);

	        h.appendChild(deleteIcon);
	        li.appendChild(h);
	        return li;
	    },

	    /*鼠标进入出现删除图标*/
	    enterEventDelegate: function() {
	        _.addEvent(this.ui, 'mouseover', this.showIcon);
	    },

	    /*鼠标移出隐藏删除图标*/
	    leaveEventDelegate: function() {
	        _.addEvent(this.ui, 'mouseout',this.hintIcon);
	    },

	    showIcon: function(e) {
	        var event = e || window.event;
	        if(event.cancelBubble) {
	            event.cancelBubble = true;
	        } else {
	            event.stopPropagation();
	        }
	        var deleteIcon = this.getElementsByClassName('fa-close')[0];
	        deleteIcon.style.display = 'inline-block';
	    },

	    hintIcon: function(e) {
	        var event = e || window.event;
	        if(event.cancelBubble) {
	            event.cancelBubble = true;
	        } else {
	            event.stopPropagation();
	        }
	        var deleteIcon = this.getElementsByClassName('fa-close')[0];
	        deleteIcon.style.display = 'none';
	    },

	    removeMouseEvent: function() {
	        _.removeEvent(this.ui, 'mouseover', this.showIcon);
	        _.removeEvent(this.ui, 'mouseout',this.hintIcon);
	    },

	    init: function() {
	        this.enterEventDelegate();
	        this.leaveEventDelegate();
	    }

	}


	return {
		File: File
	}

});