console.log('index加载成功');

require(['util','main', 'klass', 'file', 'task'], function(_, main, klass, file, task) {
	var dftKlass = new klass.Klass('默认分类');
	var dftFile = new file.File('功能介绍');
	var dftTask = new task.Task('使用说明', '2015-07-22', true, '此为任务管理器，添加分类，添加文件，添加任务说明');
	var main = new main.Main();

	main.addKlass(dftKlass);
	dftKlass.addFile(dftFile);
	dftFile.addTask(dftTask);
	dftTask.showDetail();
	dftKlass.removeMouseEvent();
	dftFile.removeMouseEvent();

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
	        var newKlass = new klass.Klass(name);
	        main.addKlass(newKlass);
	    } else {
	        var newFile = new file.File(name);
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
	    }
	});

	/*点击保存按钮*/
	_.addEvent(_.$('.edit-submit .save'), 'click', function() {
	    var currentFile = main.currentKlass.currentFile;
	    var currentTask = currentFile.currentTask;

	    // 通过编辑按钮是否隐藏来判断当前操作是编辑任务还是新建任务
	    if(_.$('.detail-head').style.display == 'block') {
	        /*var newTask = new Task(newName, newDate, false, newDetail);*/
	        currentFile.removeTask(currentTask);
	    }

	    var newTask = new task.Task('', '', false, '');
	    newTask.submitEdit();
	    currentFile.addTask(newTask);
	    newTask.showDetail();
	    main.setSum();
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
	            currentTask.finishTask();
	            currentFile.list.updateBoth();
	            this.style.display = 'none';
	            break;
	        case 'edit fa fa-pencil-square-o':
	            currentTask.edit();
	            break;
	        default :
	            break;
	    }
	});

});