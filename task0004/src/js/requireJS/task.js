console.log('task加载成功');

define(['util', 'appEvent'], function(_, ae) {

	function Task(name, date, finished, detail, id) {
		this.id = id;
	    this.name = name;
	    this.date = date;
	    this.finished = finished;
	    this.detail = detail;
	    this.ui = null;        //在ui的全部列表中绑定的DOM元素
	    /*this.list = new List();   //对应的list列表*/
	    this.parent = null;    //它的父类 也就是File
	}

	Task.prototype = {
	    constructor: Task,

	    setId: function(id) {
	    	if(typeof id != 'number') return;
	    	else {
	    		this.id = id;
	    	}
	    },

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

	    setParent: function(pa) {
	        this.parent = pa;
	    },

	    showDetail: function() {
	        _.$('.task-name').innerHTML = this.name;
	        _.$('.task-date').innerHTML = this.date;
	        _.$('.detail-body').innerHTML = this.detail;
	        _.$('.edit-submit').style.display = 'none';
	        if(this.finished) {
	            _.$('.detail-head').style.display = 'none';
	        } else {
	            _.$('.detail-head').style.display = 'block';
	        }
	        this.parent.currentTask = this;
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
	        _.$('.task-name').innerHTML = editName;

	        var editDate = '<input class="input-date" type=';
	        if(this.date) {
	            editDate += '"text" value=' + this.date;
	        }else {
	            editDate += '"date"';
	        }
	        editDate += ' />';
	        _.$('.task-date').innerHTML = editDate;

	        var editDetail = '<textarea class="input-detail" ';
	        if(this.detail) {
	            editDetail += '>' + this.detail + '</textarea>';
	        }else {
	            editDetail += 'palceholder="请输入任务内容"></textarea>';
	        }
	        _.$('.detail-body').innerHTML = editDetail;
	        _.$('.edit-submit').style.display = 'block';
	    },

	    /*提交编辑信息*/
	    submitEdit: function() {
	        var name = _.$('.input-name').value,
	            date = _.$('.input-date').value,
	            detail = _.$('.input-detail').value;

	        if(name == '') {
	            alert('请输入任务名称');
	            return false;
	        }
	        if(date == '') {
	            alert('请输入日期');
	            return false;
	        }
	        this.name = name;
	        this.date = date;
	        this.detail = detail;
	        return true;
	        //currentKlass.currentFile.list.showTask(this);
	    },

	    /*点击任务的完成按钮*/
	    finishTask: function() {
	        this.finished = true;
	        _.addClass(this.ui, 'done');
	    },

	    clickHandler: function() {
	        var that = this;
	        _.addEvent(this.ui, 'click', function() {
	            that.showDetail();

	            if(_.getViewWidth() <= _.appMaxWith) {
	            	ae.nextIn();
	            }

	        });
	    },

	    init: function() {
	        this.clickHandler();
	    }

	}


	return {
		Task: Task
	}

});