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
		var next = _.$('.nextview');

		if(!next) {
			next = cur.next;
			_.addClass(next, 'nextview');
		}

		_.addClass(cur, 'left');
		_.addClass(next, 'mid');

		_.removeClass(cur, 'currentview');
		_.addClass(cur, 'preview');
		_.removeClass(cur, 'left');
		
		_.addClass(next, 'currentview');
		_.removeClass(next, 'nextview');
		_.removeClass(next, 'mid');

		if(cur.pre && _.hasClass(cur.pre, 'preview')) {
			_.removeClass(cur.pre, 'preview');
		}

		backtoggle();

	}

	function preIn() {
		var cur = _.$('.currentview');
		var pre = _.$('preview');

		if(!pre) {
			pre = cur.pre;
			_.addClass(pre, 'preview');
		}
		
		_.addClass(cur, 'right');
		_.addClass(pre, 'mid');

		_.removeClass(cur, 'currentview');
		_.removeClass(cur, 'right');
		_.addClass(cur, 'next');
		
		_.addClass(pre, 'currentview');
		_.removeClass(pre, 'preview');
		_.removeClass(pre, 'mid');

		if(cur.next && _.hasClass(cur.next, 'nextview')) {
			_.removeClass(cur.next, 'nextview');
		}

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