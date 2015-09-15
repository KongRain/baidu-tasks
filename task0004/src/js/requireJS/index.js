console.log('index加载成功');

require(['util','main', 'klass', 'file', 'task', 'appEvent', 'localStorage'], function(_, main, klass, file, task, ae, local) {

	//初始化列表
	function init() {
		var nonInitHander = populateStorage;
		var initedHandler = setDoms;
		local.initData(nonInitHander, initedHandler);
		setDft();
		main.setSum();

	}

	function populateStorage() {
		local.setDefault();
		setDoms();
	}

	function setDoms() {
		//遍历本地存储的一级分类，并新建对象
		var klasses = local.getKlass();
		for(var i = 0, len = klasses.length; i < len; i++) {
			var theKlass = klasses[i];
			var kName = theKlass.name,
			    kId = theKlass.id;
			var klassObj = new klass.Klass(kName, kId);
			main.addKlass(klassObj);

			//遍历当前一级分类的二级子类，并新建对象
			var fileIds = theKlass.children;
			for(var j = 0, len2 = fileIds.length; j < len2; j++) {
				var theFile = local.getItem(fileIds[j], 'file');
				var fileObj = new file.File(theFile.name, theFile.id);
				klassObj.addFile(fileObj);

				//遍历当前二级子类的任务， 并新建对象
				var taskIds = theFile.children;
				for(var k = 0, len3 = taskIds.length; k < len3; k++) {
					var theTask = local.getItem(taskIds[k], 'task');
					var taskObj = new task.Task(theTask.name, theTask.date, theTask.finished, theTask.detail, theTask.id);
					fileObj.addTask(taskObj);
					taskObj.showDetail();
				}
			}
		}
	}

	function setDft() {
		var dftKlass = main.getKlassById(0);
		var dftFile = dftKlass.getFileById(0);
		var dftTask = dftFile.getTaskById(0);
		main.setCurrentKlass(dftKlass);       //设置当前类别
		dftKlass.setCurrentFile(dftFile);     //设置当前文件
	    dftFile.showTasks();
	    dftTask.showDetail();
	    dftKlass.removeMouseEvent();
		dftFile.removeMouseEvent();
	}

	var main = new main.Main();
	init();


	/**
	 * ===================================== 新建分类 ===========================================
	 */

	/*点击新建任务按钮*/
	_.addEvent(_.$('.task-class .addition'),'click', function() {
	    _.$('.prompt').style.display = 'block';
	});

	/*点击确定按钮*/
	_.addEvent(_.$('.prompt .sure'), 'click', function() {
	    var type = _.$('#select-class').value;
	    var name = _.$('#class-name').value;
	    if(name == '') {
	        alert('请填写任务名称');
	    }
	    if(type == 'parent') {
	    	var klassData = local.addItem('klass', name);   //在数据库中添加
	        var newKlass = new klass.Klass(name, klassData.id);
	        main.addKlass(newKlass);
	    } else {
	    	var fileData = local.addFile(main.currentKlass.id, name);  //在数据库中添加
	        var newFile = new file.File(name, fileData.id);
	        main.currentKlass.addFile(newFile);
	        newFile.showTasks();
	    }
	    _.$('.prompt').style.display = 'none';
	    _.$('#class-name').value = '';
	    _.$('#select-class').value = 'parent';
	});

	/*点击取消按钮*/
	_.addEvent(_.$('.prompt .cancel'), 'click', function() {
	    _.$('.prompt').style.display = 'none';
	    _.$('#class-name').value = '';
	    _.$('#select-class').value = 'parent';
	});

	/**
	 * ================================= 新建任务 =================================
	 */

	/*点击新建任务按钮*/
	_.addEvent(_.$('.task-list .addition'), 'click', function() {
	    var currentFile = main.currentKlass.currentFile;
	    if(!currentFile) {
	        alert('请先创建子分类');
	        return;
	    } else {
	        var newTask = new task.Task('', '', true, '');
	        _.$('.detail-head').style.display = 'none';
	        newTask.edit();

	        if(_.getViewWidth() <= _.appMaxWith) {
	        	ae.nextIn();
	        }
	    }
	});

	/*点击保存按钮*/
	_.addEvent(_.$('.edit-submit .save'), 'click', function() {
	    var currentFile = main.currentKlass.currentFile;
	    var currentTask = currentFile.currentTask;

	    // 通过编辑按钮是否隐藏来判断当前操作是编辑任务还是新建任务
	    // 隐藏时为新建任务，显示时为编辑任务
	    if(_.$('.detail-head').style.display == 'block') {
	        
	        currentFile.list.deleteTask(currentTask);
	        currentTask.submitEdit();
	        currentFile.list.showTask(currentTask);
	        //改变数据库
	        local.modifyItem('task', currentTask.id, 'name', currentTask.name);
            local.modifyItem('task', currentTask.id, 'date', currentTask.date);
            local.modifyItem('task', currentTask.id, 'detail', currentTask.detail);
            currentTask.showDetail();
	    } 
        else {
        	var newTask = new task.Task('', '', false, '');
		    var success = newTask.submitEdit();
		    if(!success) {
		    	return false;
		    }

		    //在数据库中添加
		    var taskData = local.addTask(currentFile.id, newTask.name, newTask.date, newTask.finished, newTask.detail);

		    newTask.setId(taskData.id);
		    currentFile.addTask(newTask);
		    newTask.showDetail();
		    main.setSum();

        }
	});

	/*点击取消按钮*/
	_.addEvent(_.$('.edit-submit .cancel'), 'click', function() {
	    var currentFile = main.currentKlass.currentFile;
	    var currentTask = currentFile.currentTask;
	    if(currentTask) {
	        currentTask.showDetail();
	    }else{
	        var task = new task.Task('', '', true, '');
	        task.showDetail();
	    }
	});

	/**
	 * ===================================== 编辑任务 ===================================
	 */
	/*点击编辑或完成按钮*/
	_.addEvent(_.$('.detail-head'), 'click', function(e) {
	    var target = _.getTarget(e);
	    var cName = target.className;
	    var currentFile = main.currentKlass.currentFile;
	    var currentTask = currentFile.currentTask;
	    switch (cName) {
	        case 'ok fa fa-check-square-o':
	        	//改变数据库
	        	local.modifyItem('task', currentTask.id, 'finished', true);

	            currentTask.finishTask();
	            currentFile.list.updateBoth();
	            currentFile.otherListHandler();
	            this.style.display = 'none';
	            break;
	        case 'edit fa fa-pencil-square-o':
	            currentTask.edit();
	            break;
	        default :
	            break;
	    }
	});

	/**
	 *==================================== 点击返回按钮 ==================================
	 */

	_.addEvent(_.$('.back'), 'click', function() {
		ae.preIn();
	})

});