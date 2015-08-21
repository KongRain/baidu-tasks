console.log('appEvent加载成功');

define(['util'], function(_) {

	var articles = document.getElementsByTagName('article');

	articles[0].pre = null;
	articles[0].next = articles[1];
	articles[1].pre = articles[0];
	articles[1].next = articles[2];
	articles[2].pre = articles[1];
	articles[2].next = null;


	function nextIn() {
		var cur = _.$('.currentview');
		var next = cur.next;

		if(!_.hasClass(next, 'nextview')) {
			_.addClass(next, 'nextview');
		}

		_.removeClass(cur, 'currentview');
		_.addClass(cur, 'preview');
		_.removeClass(next, 'nextview');
		_.addClass(next, 'currentview');

		backtoggle();

	}

	function preIn() {
		var cur = _.$('.currentview');
		var pre = cur.pre;

		if(!_.hasClass(pre, 'preview')) {
			_.addClass(pre, 'preview');
		}

		_.removeClass(cur, 'currentview');
		_.addClass(cur, 'nextview');
		_.removeClass(pre, 'preview');
		_.addClass(pre, 'currentview');

		backtoggle();
		
	}

	//返回按钮的显示与隐藏
	function backtoggle() {
		var back = _.$('.back');
		var cur = _.$('.currentview');
		if(_.hasClass(cur, 'task-class')) {
			back.style.display = 'none';
		} else {
			back.style.display = 'block';
		}
	}

	return {
		nextIn: nextIn,
		preIn:  preIn
	}
});