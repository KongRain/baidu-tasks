console.log('main加载成功');

define(['util', 'appEvent'], function(_, ae) {

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
	        klass.setParent(this);
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
	            _.$('.class-list').removeChild(klass.ui);    //在页面中删除DOM元素
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
	        var num = 0;
	        this.klasses.forEach(function(klass) {
	            klass.files.forEach(function(file) {
	                num += file.tasks.length;
	            });
	        });
	        return num;
	    },

	    setSum: function() {
	        this.sum = this.getSum();
	        _.$('.task-class .sum').innerHTML = this.sum;
	    },

	    setCurrentKlass: function(klass) {
	        this.currentKlass = klass;

	        //取消其他所有高亮
	        var actives = _.$('.class-list').getElementsByClassName('active');
	        Array.prototype.forEach.call(actives, function(active) {
	            _.removeClass(active, 'active');
	        });

	        klass.highLight();
	    },

	    init: function() {
	        /*this.addKlass(dftKlass);
	        dftKlass.addFile(dftFile);
	        dftFile.addTask(dftTask);
	        dftTask.showDetail();*/
	        this.eventDelegate();
	        this.cilckDelete();
	        this.setSum();
	    },

	    /*一级任务点击事件代理 点击一级任务显示或隐藏二级任务*/
	    eventDelegate: function() {
	        var that = this;
	        _.addEvent(_.$('.class-list'), 'click', function(e) {
	            var target = _.getTarget(e);
	            var targetTag = target.tagName.toLowerCase();
	            while(targetTag != 'h3' && targetTag != 'h4') {
	                target = target.parentNode;
	                targetTag = target.tagName.toLowerCase();
	            }
	            if(targetTag == 'h4') return;

	            var klassName = target.lastChild.nodeValue;
	            klassName = klassName.replace(/\s*\(\d+\)$/, "");
	            var currentKlass = that.getKlass(klassName);
	            that.setCurrentKlass(currentKlass);     //设置当前文件
	            currentKlass.toggle();
	            if(_.getViewWidth() <= _.appMaxWith) {
	            	ae.nextIn();
	            }
	        });

	    },

	    /*点击删除图标删除此分类（一级分类）*/
	    cilckDelete: function() {
	        var that = this;

	        _.addEvent(_.$('.class-list'), 'click', function(e) {
	            var event = e || window.event;
	            var target = _.getTarget(e);
	            if(_.hasClass(target, 'fa-close') && target.parentNode.nodeName.toLowerCase() == 'h3') {
	                if(event.cancelBubble) {
	                    event.cancelBubble = true;
	                } else {
	                    event.stopPropagation();
	                }
	                var answer = confirm('确定删除此分类？');
	                if(answer) {
	                    var klassName = target.parentNode.lastChild.nodeValue;
	                    klassName = klassName.replace(/\s*\(\d+\)$/, "");
	                    var klass = that.getKlass(klassName);
	                    that.removeKlass(klass);

	                    //更新总任务数量
	                    var sum = _.$('.sum').innerHTML;
	                    var deleteNum = 0;
	                    klass.files.forEach(function(file) {
	                        deleteNum += file.tasks.length;
	                    });
	                    sum -= deleteNum;
	                    _.$('.sum').innerHTML = sum;
	                }
	            }

	        });
	    }
	}


	return {
		Main: Main
	}

});