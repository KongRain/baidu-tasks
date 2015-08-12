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
		/*if(!next) {
			curIndex = articles.indexOf(cur);
			next = articles[cur+1];
		}*/
		if(!next) {
			next = cur.next;
		}
		
		_.addClass(cur, 'preview');
		_.removeClass(cur, 'currentview');
		
		_.addClass(next, 'currentview');
		_.removeClass(next, 'nextview');

		_.addClass(next.next, 'nextview');
	}

	function preIn() {
		var cur = _.$('.currentview');
		var pre = _.$('preview');

		if(!pre) {
			pre = cur.pre;
		}
		
		_.addClass(cur, 'nextview');
		_.removeClass(cur, 'currentview');
		
		_.addClass(pre, 'currentview');
		_.removeClass(pre, 'preview');
		

	}

	return {
		nextIn: nextIn,
		preIn:  preIn
	}
});