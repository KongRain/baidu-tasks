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
				'detail' : "此款任务管理器支持多级任务处理，可以添加、删除、编辑任务，可以为任务分类，记录任务生成时间等。\n\nps:默认分类与默认文件不能删除哦！"
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


	// 获得某一类别当前的最大id号
	function getFinalId(item) {
		var allItems = JSON.parse(localStorage.getItem(item));
		var len = allItems.length;
		var finalId = allItems[len - 1].id;
		return finalId;
	}

	//在某一类别中新建对象
	function addItem(key, name, date, finished, detail) {
		var id = getFinalId(key) + 1;

		if(key == 'klass' || key == 'file') {
			
			var newItem = {
				'id': id,
				'name': name,
				'children': []
			}

		} else if(key == 'task') {

			var newItem = {
				'id': id,
				'name': name,
				'date': date,
				'finished' : finished,
				'detail' : detail
			}
		}

		var oldItem = JSON.parse(localStorage.getItem(key));
		oldItem.push(newItem);
		localStorage.setItem(key, JSON.stringify(oldItem));

		return newItem;
		
	}


	//修改某一类别的某个属性
	/**
	 * @param key {String} 类别名 'klass' | 'file' | 'task'
	 * @param id {Num} 根据id查找该类别中对应的实例 
	 * @param prop {String} 要改变的属性
	 * @param value 新的属性值
	 *
	 */

	function modifyItem(key, id, prop, value) {
		var oldItems = JSON.parse(localStorage.getItem(key));
		var theItem = null;   //要找到的对应id的对象
		for(var i = 0, len = oldItems.length; i < len; i++) {
			if(oldItems[i].id === id) {
				theItem = oldItems[i];
				break;
			}
		}
		theItem[prop] = value;

		localStorage.setItem(key, JSON.stringify(oldItems));
	}

	//添加新的二级类别到指定一级类别中
	function addFile(klassId, name) {
		var newFile = addItem('file', name);
		var parentKlass = getItem(klassId, 'klass');
		var oldChild = parentKlass.children;
		oldChild.push(newFile.id);
		modifyItem('klass', klassId, 'children', oldChild);

		return newFile;
	}

	//添加新的任务到指定二级类别中
	function addTask(fileId, name, date, finished, detail) {
		var newTask = addItem('task', name, date, finished, detail);
		var parentFile = getItem(fileId, 'file');
		var oldChild = parentFile.children;
		oldChild.push(newTask.id);
		modifyItem('file', fileId, 'children', oldChild);

		return newTask;
	}

	//在某一分类中删除一个对象
	function deleteItem(key, id) {
		var oldItems = JSON.parse(localStorage.getItem(key));
		var item = null;
		for(var i=0, len=oldItems.length; i<len; i++) {
			if(oldItems[i].id === id) {
				item = oldItems[i];
				oldItems.splice(i, 1);
				break;
			}
		}

		localStorage.setItem(key, JSON.stringify(oldItems));	
	}

    return {
    	initData : initData,
    	setDefault: setDefault,
    	getKlass: getKlass,
    	getItem: getItem,
    	getFinalId: getFinalId,
    	addItem: addItem,
    	modifyItem: modifyItem,
    	addFile: addFile,
    	addTask: addTask,
    	deleteItem: deleteItem
    }

})
