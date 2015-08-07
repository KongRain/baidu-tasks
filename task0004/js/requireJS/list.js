console.log('list加载成功');

define(['util'], function(_) {
	//这个类只负责显示三级任务 包括日期聚类，在列表中新建任务的显示等
	function List() {
	    //this.tasks = tasks;            //对应的全部三级任务
	    this.allList = _.$('.all');         //全部列表
	    this.doneList = _.$('.finish');           //已完成列表
	    this.undoneList = _.$('.unFinish');        //未完成列表
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
	        _.addClass(taskBlock, "item");
	        if (task.finished) {
	            _.addClass(taskBlock, "done");
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
	        _.addClass(dateItem, 'dateItem');
	        _.addClass(dateBlock, 'date');
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
	                _.removeClass(that, "done");
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
	        var b_all = _.$('.task-list .b-all'),
	            b_undone = _.$('.task-list .b-undone'),
	            b_done =_.$('.task-list .b-done');

	        if (option == 'all') {
	            _.addClass(b_all, "active");
	            _.removeClass(b_done, "active");
	            _.removeClass(b_undone, "active");
	            this.allList.style.display = "block";
	            this.doneList.style.display = this.undoneList.style.display = "none";
	        } else if (option == 'undone') {
	            _.addClass(b_undone, "active");
	            _.removeClass(b_all, "active");
	            _.removeClass(b_done, "active");
	            this.undoneList.style.display = "block";
	            this.allList.style.display = this.doneList.style.display = "none";
	        } else {
	            _.addClass(b_done, "active");
	            _.removeClass(b_undone, "active");
	            _.removeClass(b_all, "active");
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
	        _.addEvent(_.$('.task-list ul'), 'click', function(e) {
	            var event = e || window.event;
	            var target = _.getTarget(event);
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


	return {
		List: List
	}

});