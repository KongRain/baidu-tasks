console.log('localStorage加载成功');

define(function() {

	//初始化本地数据存储，如果没有本地存储数据就加入默认类
	function initData(nonInitHandler, initedHandler) {
		if(!localStorage.getItem('klass')) {
			nonInitHandler();
		} else {
			initedHandler();
		}
	}

	//为localStorage放置默认类
	function setDefault() {
		var defaultKlass = [{
				'id' : 0,
				'name' : "默认分类",
				'children' : [0] 
			}];

			var defaultFile = [{
				'id' : 0,
				/*'parent': 0,*/
				'name': "功能介绍",
				'children' : [0]
			}];

			var defaultTask = [{
				'id' : 0,
				/*'parent': 0,*/
				'name' : "使用说明",
				'date': "2015-07-22",
				'finished' : true,
				'detail' : "此为任务管理器，添加分类，添加文件，添加任务说明"
			}];

			localStorage.setItem('klass', JSON.stringify(defaultKlass));
			localStorage.setItem('file', JSON.stringify(defaultFile));
			localStorage.setItem('task', JSON.stringify(defaultTask));
	}


	//获得所有一级分类 klass
	function getKlass() {
		if(!localStorage.getItem('klass')) {
			console.log('no klass in storage');
			return false;
		}
		var klassString = localStorage.getItem('klass');
		var klasses = JSON.parse(klassString);
		console.log('allKlasses: ' + klasses);
		return klasses;
	}

	//通过id获得item
	/**
	 * @param id {Num} 要查询的id号
	 * @param itemName {String} 要查询的类别名 klass|file|task
	 * 
	 * @return item {Obj} 查到的对象
	 */

	function getItem(id, itemName) {
		if(!localStorage.getItem(itemName)) {
			console.log('no ' + itemName + 'in storage');
			return false;
		}
		var item;    //最终获得的item
		var allItems = JSON.parse(localStorage.getItem(itemName));
		for(var i = 0, len = allItems.length; i < len; i++) {
			if(allItems[i].id === id) {
				item = allItems[i];
				break;
			}
		}

		console.log('' + itemName  + id + ': ' + item);
		return item;
	}

/*	//获得某一级分类下的所有二级分类 file
	function getFile(klassId) {
		if(!localStorage.file) {
			console.log('no file in storage');
			return false;
		}
		var files = [];  //最终查到的结果
		var allFiles = JSON.parse(localStorage.getItem('file'));
		for(var i=0, len = allFiles.length; i < len; i++) {
			if(allFiles[i].parent === klassId) {
				files.push(allFiles[i]);
			}
		}

		console.log(files);
		return files;
	}

	//获得某二级分类下的所有任务 task
	function getTask(fileId) {
		if(!localStorage.task) {
			console.log('no file in storage');
			return false;
		}

		var tasks = [];   //最终查到的结果
		var allTasks = JSON.parse(localStorage.getItem('task'));
		for(var i = 0, len = allTasks.length; i < len; i++) {
			if(allTasks[i].parent === fileId) {
				tasks.push(allTasks[i]);
			}
		}

		console.log(tasks);
		return tasks;
	}*/


	// 获得某一类别当前的最大id号
	function getFinalId(item) {
		var allItems = JSON.parse(localStorage.getItem(item));
		var len = allItems.length;
		var finalId = allItems[len - 1].id;
		return finalId;
	}

    return {
    	initData : initData,
    	setDefault: setDefault,
    	getKlass: getKlass,
    	getItem: getItem,
    	getFinalId: getFinalId
    }

})
