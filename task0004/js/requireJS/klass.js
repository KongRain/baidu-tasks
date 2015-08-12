console.log('klass加载成功');

define(['util', 'appEvent'], function(_, ae) {

	function Klass(name) {
	    this.name = name;
	    this.files = [];     //包含的二级子任务 每个元素均为二级任务类File
	    this.ui = null;      //在ui中绑定的DOM元素
	    this.currentFile = null;      //当前操作的二级文件
	    this.parent = null;      //它的父类 也就是Main
	}

	Klass.prototype = {
	    constructor: Klass,

	    /*在页面中显示*/
	    show: function() {
	        var list = _.$('.task-class .class-list');
	        var li = this.createLi('folder');
	        this.setUI(li);
	        var h3 = li.getElementsByTagName('h3')[0];
	        var textNode = document.createTextNode(this.name + '(' + this.files.length + ')');
	        h3.appendChild(textNode);
	        list.appendChild(li);
	    },

	    /*为此对象绑定DOM元素*/
	    setUI: function(ui) {
	        this.ui = ui;
	    },

	    /*设置当前二级任务*/
	    setCurrentFile: function(file) {
	        this.currentFile = file;

	        this.parent.setCurrentKlass(this);

	        //取消其他所有高亮
	        var actives = _.$('.class-list').getElementsByClassName('active');
	        Array.prototype.forEach.call(actives, function(active) {
	            _.removeClass(active, 'active');
	        });

	        file.highLight();
	        
	    },

	    /*设置父类*/
	    setParent: function(pa) {
	        this.parent = pa;
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
	        file.setParent(this);
	    },

	    updateLength: function() {
	        var h3 = this.ui.getElementsByTagName('h3')[0];
	        h3.lastChild.nodeValue = this.name + '(' + this.files.length + ')';
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
	        _.addClass(this.ui.getElementsByTagName('h3')[0], 'active');
	    },

	    /*取消高光*/
	    unHighLight: function() {
	        _.removeClass(this.ui.getElementsByTagName('h3')[0], 'active');
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

	    /*二级任务点击事件代理   点击二级任务在list列表中显示其子任务*/
	    clickEventDelegate: function() {
	        var that = this;
	        _.addEvent(_.$('.class-list'), 'click', function(e) {
	            var event = e || window.event;
	            var target = _.getTarget(event);
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
	            var fileName = target.lastChild.nodeValue;
	            fileName = fileName.replace(/\s*\(\d+\)$/, "");
	            var currentFile = that.getFile(fileName);
	            if(!currentFile) return;
	            that.setCurrentFile(currentFile);     //设置当前文件
	            currentFile.showTasks();

	            if(_.getViewWidth() <= _.appMaxWith) {
	            	ae.nextIn();
	            }
	        });
	    },

	    /*鼠标进入出现删除图标*/
	    enterEventDelegate: function() {
	        _.addEvent(this.ui, 'mouseover', this.showIcon);
	    },

	    /*鼠标移出隐藏删除图标*/
	    leaveEventDelegate: function() {
	        _.addEvent(this.ui, 'mouseout', this.hintIcon);
	    },

	    showIcon: function() {
	        var deleteIcon = this.getElementsByClassName('fa-close')[0];
	        deleteIcon.style.display = 'inline-block';
	    },

	    hintIcon: function() {
	        var deleteIcon = this.getElementsByClassName('fa-close')[0];
	        deleteIcon.style.display = 'none';
	    },

	    //默认分类不能删除 所以要取消时间绑定
	    removeMouseEvent: function() {
	        _.removeEvent(this.ui, 'mouseover', this.showIcon);
	        _.removeEvent(this.ui, 'mouseout',this.hintIcon);
	    },

	    /*点击删除图标删除此文件（二级分类）*/
	    cilckDelete: function() {
	        var that = this;
	        //var deleteIcon = this.getElementsByClassName('delete')[0];
	        _.addEvent(this.ui, 'click', function(e) {
	            var event = e || window.event;
	            var target = _.getTarget(e);
	            if(_.hasClass(target, 'fa-close') && target.parentNode.nodeName.toLowerCase() == 'h4') {
	                if(event.cancelBubble) {
	                    event.cancelBubble = true;
	                } else {
	                    event.stopPropagation();
	                }
	                var answer = confirm('确定删除此分类？');
	                if(answer) {
	                    var fileName = target.parentNode.lastChild.nodeValue;
	                    fileName = fileName.replace(/\s*\(\d+\)$/, "");
	                    var file = that.getFile(fileName);
	                    that.removeFile(file);

	                    //更新总任务数量
	                    var sum = parseInt(_.$('.sum').innerHTML);
	                    sum -= file.tasks.length;
	                    _.$('.sum').innerHTML = sum;
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


	return {
		Klass: Klass
	}

});