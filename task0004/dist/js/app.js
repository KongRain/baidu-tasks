console.log('util\u52A0\u8F7D\u6210\u529F');
define('util', [], function () {
    function addEvent(ele, type, listener) {
        var type = type.replace(/^on/, '').toLowerCase();
        if (ele.addEventListener) {
            ele.addEventListener(type, listener, false);
        } else if (ele.attachEvent) {
            ele.attachEvent('on' + type, listener);
        }
    }
    function removeEvent(ele, type, listener) {
        var type = type.replace(/^on/, '').toLowerCase();
        if (ele.removeEventListener) {
            ele.removeEventListener(type, listener, false);
        } else if (ele.detachEvent) {
            ele.detachEvent('on' + type, listener);
        }
    }
    function delegateEvent(ele, tag, type, listener) {
        addEvent(ele, type, function (e) {
            var event = e || window.event;
            var target = getTarget(e);
            var tagName = target.nodeName.toLowerCase();
            while (tagName != tag && target != ele) {
                target = target.parentNode;
                tagName = target.nodeName.toLowerCase();
            }
            if (tagName == tag) {
                listener.call(target, event);
            }
        });
    }
    function getTarget(e) {
        var event = e || window.event;
        var target = e.srcElement || e.target;
        return target;
    }
    function objLen(obj) {
        var len = 0;
        for (var name in obj) {
            if (obj.hasOwnProperty(name)) {
                len++;
            }
        }
        return len;
    }
    function trim(str) {
        return str.replace(/^\s*|\s*$/g, '');
    }
    function addClass(element, newClassName) {
        var result;
        if (typeof newClassName === 'string') {
            var classes = (newClassName || '').match(/\S+/g) || [];
            var elementClass = element.className;
            var cur = element.nodeType === 1 && (elementClass ? (' ' + elementClass + ' ').replace(/[\t\r\n\f]/g, ' ') : ' ');
            if (cur) {
                var len = classes.length;
                for (var i = 0; i < len; i++) {
                    if (cur.indexOf(' ' + classes[i] + ' ') < 0) {
                        cur += classes[i] + ' ';
                    }
                }
            }
            result = trim(cur);
            if (elementClass != result) {
                element.className = result;
            }
        }
    }
    function removeClass(ele, name) {
        var oldClass = ele.className;
        if (oldClass.length == 0)
            return;
        var oldArray = oldClass.split(/\s+/);
        for (var i = 0, len = oldArray.length; i < len; i++) {
            if (oldArray[i] == name) {
                oldArray.splice(i, 1);
            }
        }
        var newClass = oldArray.join(' ');
        ele.className = newClass;
    }
    function hasClass(element, className) {
        if (className && element.className) {
            var classes = element.className.split(/\s+/);
            for (var i = 0, len = classes.length; i < len; i++) {
                if (className === classes[i]) {
                    return true;
                }
            }
        }
        return false;
    }
    function $(sector) {
        if (!sector || typeof sector != 'string') {
            return false;
        }
        var element;
        var reg = /\s+/;
        if (!reg.test(sector)) {
            element = noGrade(document, sector)[0];
        } else {
            var subSectors = sector.split(' ');
            var firstList = noGrade(document, subSectors[0]);
            for (var i = 0; i < firstList.length; i++) {
                var secondList = noGrade(firstList[i], subSectors[1]);
                if (secondList.length) {
                    element = secondList[0];
                    break;
                }
            }
        }
        return element;
    }
    $.on = function (sector, event, listener) {
        var element = $(sector);
        return addEvent(element, event, listener);
    };
    $.un = function (sector, event, listener) {
        var element = $(sector);
        return removeEvent(element, event, listener);
    };
    $.click = function (sector, listener) {
        var element = $(sector);
        return addClickEvent(element, listener);
    };
    $.enter = function (sector, listener) {
        var element = $(sector);
        return addEnterEvent(element, listener);
    };
    $.delegate = function (sector, tag, event, listener) {
        var element = $(sector);
        return delegateEvent(element, tag, event, listener);
    };
    function getElementsByAttr(parent, attr, value) {
        if (!parent || !attr) {
            return false;
        }
        var allChild = parent.getElementsByTagName('*');
        var results = new Array();
        var flag = value ? 1 : 0;
        for (var i = 0; i < allChild.length; i++) {
            if (allChild[i].hasAttribute(attr)) {
                var item = allChild[i];
                if (flag) {
                    if (item.getAttribute(attr) == value) {
                        results.push(item);
                    }
                } else {
                    results.push(item);
                }
            }
        }
        return results;
    }
    function noGrade(parent, sector) {
        if (!parent || !sector || typeof sector != 'string') {
            return false;
        }
        var eleList = new Array();
        var substr, element;
        switch (sector[0]) {
        case '#':
            substr = sector.slice(1);
            element = parent.getElementById(substr);
            eleList.push(element);
            break;
        case '.':
            substr = sector.slice(1);
            eleList = parent.getElementsByClassName(substr);
            break;
        case '[':
            if (sector.search(/=/g) == -1) {
                substr = sector.slice(1, -1);
                eleList = getElementsByAttr(parent, substr);
                break;
            } else {
                var re = /^\[(\w+)\s*=\s*('|")(\w+)('|")\]$/g;
                var result = re.exec(sector);
                var attr = result[1];
                var val = result[3];
                eleList = getElementsByAttr(parent, attr, val);
            }
            break;
        default:
            eleList = parent.getElementsByTagName(sector);
        }
        return eleList;
    }
    function createDOMByStr(str) {
        var div = document.createElement('div');
        div.innerHTML = str;
        return div.childNodes;
    }
    function getViewWidth() {
        var width = window.innerWith || document.documentElement.clientWidth || document.body.clientWidth;
        console.log('viewPortwidth:' + width);
        return width;
    }
    return {
        addEvent: addEvent,
        removeEvent: removeEvent,
        delegateEvent: delegateEvent,
        getTarget: getTarget,
        objLen: objLen,
        addClass: addClass,
        removeClass: removeClass,
        hasClass: hasClass,
        $: $,
        createDOMByStr: createDOMByStr,
        getViewWidth: getViewWidth,
        appMaxWith: 767
    };
});
console.log('appEvent\u52A0\u8F7D\u6210\u529F');
define('appEvent', ['util'], function (_) {
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
        if (!_.hasClass(next, 'nextview')) {
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
        if (!_.hasClass(pre, 'preview')) {
            _.addClass(pre, 'preview');
        }
        _.removeClass(cur, 'currentview');
        _.addClass(cur, 'nextview');
        _.removeClass(pre, 'preview');
        _.addClass(pre, 'currentview');
        backtoggle();
    }
    function backtoggle() {
        var back = _.$('.back');
        var cur = _.$('.currentview');
        if (_.hasClass(cur, 'task-class')) {
            back.style.display = 'none';
        } else {
            back.style.display = 'block';
        }
    }
    return {
        nextIn: nextIn,
        preIn: preIn
    };
});
console.log('localStorage\u52A0\u8F7D\u6210\u529F');
define('localStorage', [], function () {
    function initData(nonInitHandler, initedHandler) {
        if (!localStorage.getItem('klass')) {
            nonInitHandler();
        } else {
            initedHandler();
        }
    }
    function setDefault() {
        var defaultKlass = [{
                'id': 0,
                'name': '\u9ED8\u8BA4\u5206\u7C7B',
                'children': [0]
            }];
        var defaultFile = [{
                'id': 0,
                'name': '\u529F\u80FD\u4ECB\u7ECD',
                'children': [0]
            }];
        var defaultTask = [{
                'id': 0,
                'name': '\u4F7F\u7528\u8BF4\u660E',
                'date': '2015-07-22',
                'finished': true,
                'detail': '\u6B64\u6B3E\u4EFB\u52A1\u7BA1\u7406\u5668\u652F\u6301\u591A\u7EA7\u4EFB\u52A1\u5904\u7406\uFF0C\u53EF\u4EE5\u6DFB\u52A0\u3001\u5220\u9664\u3001\u7F16\u8F91\u4EFB\u52A1\uFF0C\u53EF\u4EE5\u4E3A\u4EFB\u52A1\u5206\u7C7B\uFF0C\u8BB0\u5F55\u4EFB\u52A1\u751F\u6210\u65F6\u95F4\u7B49\u3002\n\nps:\u9ED8\u8BA4\u5206\u7C7B\u4E0E\u9ED8\u8BA4\u6587\u4EF6\u4E0D\u80FD\u5220\u9664\u54E6\uFF01'
            }];
        localStorage.setItem('klass', JSON.stringify(defaultKlass));
        localStorage.setItem('file', JSON.stringify(defaultFile));
        localStorage.setItem('task', JSON.stringify(defaultTask));
    }
    function getKlass() {
        if (!localStorage.getItem('klass')) {
            console.log('no klass in storage');
            return false;
        }
        var klassString = localStorage.getItem('klass');
        var klasses = JSON.parse(klassString);
        console.log('allKlasses: ' + klasses);
        return klasses;
    }
    function getItem(id, itemName) {
        if (!localStorage.getItem(itemName)) {
            console.log('no ' + itemName + 'in storage');
            return false;
        }
        var item;
        var allItems = JSON.parse(localStorage.getItem(itemName));
        for (var i = 0, len = allItems.length; i < len; i++) {
            if (allItems[i].id === id) {
                item = allItems[i];
                break;
            }
        }
        console.log('' + itemName + id + ': ' + item);
        return item;
    }
    function getFinalId(item) {
        var allItems = JSON.parse(localStorage.getItem(item));
        var len = allItems.length;
        var finalId = allItems[len - 1].id;
        return finalId;
    }
    function addItem(key, name, date, finished, detail) {
        var id = getFinalId(key) + 1;
        if (key == 'klass' || key == 'file') {
            var newItem = {
                'id': id,
                'name': name,
                'children': []
            };
        } else if (key == 'task') {
            var newItem = {
                'id': id,
                'name': name,
                'date': date,
                'finished': finished,
                'detail': detail
            };
        }
        var oldItem = JSON.parse(localStorage.getItem(key));
        oldItem.push(newItem);
        localStorage.setItem(key, JSON.stringify(oldItem));
        return newItem;
    }
    function modifyItem(key, id, prop, value) {
        var oldItems = JSON.parse(localStorage.getItem(key));
        var theItem = null;
        for (var i = 0, len = oldItems.length; i < len; i++) {
            if (oldItems[i].id === id) {
                theItem = oldItems[i];
                break;
            }
        }
        theItem[prop] = value;
        localStorage.setItem(key, JSON.stringify(oldItems));
    }
    function addFile(klassId, name) {
        var newFile = addItem('file', name);
        var parentKlass = getItem(klassId, 'klass');
        var oldChild = parentKlass.children;
        oldChild.push(newFile.id);
        modifyItem('klass', klassId, 'children', oldChild);
        return newFile;
    }
    function addTask(fileId, name, date, finished, detail) {
        var newTask = addItem('task', name, date, finished, detail);
        var parentFile = getItem(fileId, 'file');
        var oldChild = parentFile.children;
        oldChild.push(newTask.id);
        modifyItem('file', fileId, 'children', oldChild);
        return newTask;
    }
    function deleteItem(key, id) {
        var oldItems = JSON.parse(localStorage.getItem(key));
        var item = null;
        for (var i = 0, len = oldItems.length; i < len; i++) {
            if (oldItems[i].id === id) {
                item = oldItems[i];
                oldItems.splice(i, 1);
                break;
            }
        }
        localStorage.setItem(key, JSON.stringify(oldItems));
    }
    return {
        initData: initData,
        setDefault: setDefault,
        getKlass: getKlass,
        getItem: getItem,
        getFinalId: getFinalId,
        addItem: addItem,
        modifyItem: modifyItem,
        addFile: addFile,
        addTask: addTask,
        deleteItem: deleteItem
    };
});
console.log('main\u52A0\u8F7D\u6210\u529F');
define('main', [
    'util',
    'appEvent',
    'localStorage'
], function (_, ae, local) {
    function Main() {
        this.klasses = [];
        this.sum = 1;
        this.currentKlass = null;
        this.init();
    }
    Main.prototype = {
        constructor: Main,
        addKlass: function (klass) {
            this.klasses.push(klass);
            klass.setParent(this);
            klass.show();
            klass.init();
            this.setCurrentKlass(klass);
        },
        removeKlass: function (klass) {
            var klasses = this.klasses;
            var index = klasses.indexOf(klass);
            if (index == -1)
                return;
            else {
                klasses.splice(index, 1);
                _.$('.class-list').removeChild(klass.ui);
            }
        },
        getKlass: function (klassName) {
            var klasses = this.klasses;
            for (var i = 0, len = klasses.length; i < len; i++) {
                if (klasses[i].name == klassName) {
                    return klasses[i];
                }
            }
        },
        getKlassById: function (id) {
            var klasses = this.klasses;
            for (var i = 0, len = klasses.length; i < len; i++) {
                if (klasses[i].id === id) {
                    return klasses[i];
                }
            }
        },
        getSum: function () {
            var num = 0;
            this.klasses.forEach(function (klass) {
                klass.files.forEach(function (file) {
                    num += file.tasks.length;
                });
            });
            return num;
        },
        setSum: function () {
            this.sum = this.getSum();
            _.$('.task-class .sum').innerHTML = this.sum;
        },
        setCurrentKlass: function (klass) {
            this.currentKlass = klass;
            var actives = _.$('.class-list').getElementsByClassName('active');
            Array.prototype.forEach.call(actives, function (active) {
                _.removeClass(active, 'active');
            });
            klass.highLight();
        },
        init: function () {
            this.eventDelegate();
            this.cilckDelete();
            this.setSum();
        },
        eventDelegate: function () {
            var that = this;
            _.addEvent(_.$('.class-list'), 'click', function (e) {
                var target = _.getTarget(e);
                var targetTag = target.tagName.toLowerCase();
                while (targetTag != 'h3' && targetTag != 'h4') {
                    target = target.parentNode;
                    targetTag = target.tagName.toLowerCase();
                }
                if (targetTag == 'h4')
                    return;
                var klassName = target.lastChild.nodeValue;
                klassName = klassName.replace(/\s*\(\d+\)$/, '');
                var currentKlass = that.getKlass(klassName);
                that.setCurrentKlass(currentKlass);
                currentKlass.toggle();
            });
        },
        cilckDelete: function () {
            var that = this;
            _.addEvent(_.$('.class-list'), 'click', function (e) {
                var event = e || window.event;
                var target = _.getTarget(e);
                if (_.hasClass(target, 'fa-close') && target.parentNode.nodeName.toLowerCase() == 'h3') {
                    if (event.cancelBubble) {
                        event.cancelBubble = true;
                    } else {
                        event.stopPropagation();
                    }
                    var answer = confirm('\u786E\u5B9A\u5220\u9664\u6B64\u5206\u7C7B\uFF1F');
                    if (answer) {
                        var klassName = target.parentNode.lastChild.nodeValue;
                        klassName = klassName.replace(/\s*\(\d+\)$/, '');
                        var klass = that.getKlass(klassName);
                        that.removeKlass(klass);
                        var klassId = klass.id;
                        var klassData = local.getItem(klassId, 'klass');
                        var children = klassData.children;
                        for (var i = 0, len = children.length; i < len; i++) {
                            local.deleteItem('file', children[i]);
                        }
                        local.deleteItem('klass', klassId);
                        var sum = _.$('.sum').innerHTML;
                        var deleteNum = 0;
                        klass.files.forEach(function (file) {
                            deleteNum += file.tasks.length;
                        });
                        sum -= deleteNum;
                        _.$('.sum').innerHTML = sum;
                    }
                }
            });
        }
    };
    return { Main: Main };
});
console.log('klass\u52A0\u8F7D\u6210\u529F');
define('klass', [
    'util',
    'appEvent',
    'localStorage'
], function (_, ae, local) {
    function Klass(name, id) {
        this.id = id;
        this.name = name;
        this.files = [];
        this.ui = null;
        this.currentFile = null;
        this.parent = null;
    }
    Klass.prototype = {
        constructor: Klass,
        show: function () {
            var list = _.$('.task-class .class-list');
            var li = this.createLi('folder');
            this.setUI(li);
            var h3 = li.getElementsByTagName('h3')[0];
            var textNode = document.createTextNode(this.name + '(' + this.files.length + ')');
            h3.appendChild(textNode);
            list.appendChild(li);
        },
        setUI: function (ui) {
            this.ui = ui;
        },
        setCurrentFile: function (file) {
            this.currentFile = file;
            this.parent.setCurrentKlass(this);
            var actives = _.$('.class-list').getElementsByClassName('active');
            Array.prototype.forEach.call(actives, function (active) {
                _.removeClass(active, 'active');
            });
            file.highLight();
        },
        setParent: function (pa) {
            this.parent = pa;
        },
        addFile: function (file) {
            this.files.push(file);
            var fileUI = file.createUI();
            var subList = this.ui.getElementsByTagName('ul')[0];
            if (subList) {
                subList.appendChild(fileUI);
            } else {
                var newList = document.createElement('ul');
                newList.appendChild(fileUI);
                this.ui.appendChild(newList);
            }
            this.setCurrentFile(file);
            this.updateLength();
            file.init();
            file.setParent(this);
        },
        updateLength: function () {
            var h3 = this.ui.getElementsByTagName('h3')[0];
            h3.lastChild.nodeValue = this.name + '(' + this.files.length + ')';
        },
        removeFile: function (file) {
            var files = this.files;
            var index = files.indexOf(file);
            if (index == -1)
                return;
            else {
                files.splice(index, 1);
                this.ui.getElementsByTagName('ul')[0].removeChild(file.ui);
                this.updateLength();
            }
        },
        toggle: function () {
            if (this.files.length == 0)
                return;
            var subList = this.ui.getElementsByTagName('ul')[0];
            if (subList) {
                if (subList.style.display == 'block') {
                    subList.style.display = 'none';
                } else {
                    subList.style.display = 'block';
                }
            } else {
                var ul = document.createElement('ul');
                this.ui.appendChild(ul);
                this.files.forEach(function (file) {
                    ul.appendChild(file.createUI());
                });
            }
        },
        getFile: function (fileName) {
            var files = this.files;
            for (var i = 0, len = files.length; i < len; i++) {
                if (files[i].name == fileName) {
                    return files[i];
                }
            }
        },
        getFileById: function (id) {
            var files = this.files;
            for (var i = 0, len = files.length; i < len; i++) {
                if (files[i].id == id) {
                    return files[i];
                }
            }
        },
        highLight: function () {
            _.addClass(this.ui.getElementsByTagName('h3')[0], 'active');
        },
        unHighLight: function () {
            _.removeClass(this.ui.getElementsByTagName('h3')[0], 'active');
        },
        createLi: function (type) {
            var type = type ? type : 'folder';
            var li = document.createElement('li');
            var h;
            if (type == 'folder') {
                h = document.createElement('h3');
            } else {
                h = document.createElement('h4');
            }
            var deleteIcon = document.createElement('i');
            deleteIcon.className = 'fa fa-close';
            _.addClass(h, type);
            h.appendChild(deleteIcon);
            li.appendChild(h);
            return li;
        },
        clickEventDelegate: function () {
            var that = this;
            _.addEvent(_.$('.class-list'), 'click', function (e) {
                var event = e || window.event;
                var target = _.getTarget(event);
                var targetTag = target.tagName.toLowerCase();
                while (targetTag != 'h3' && targetTag != 'h4') {
                    target = target.parentNode;
                    targetTag = target.tagName.toLowerCase();
                }
                if (targetTag == 'h3')
                    return;
                if (event.cancelBubble) {
                    event.cancelBubble;
                } else {
                    event.stopPropagation();
                }
                var fileName = target.lastChild.nodeValue;
                fileName = fileName.replace(/\s*\(\d+\)$/, '');
                var currentFile = that.getFile(fileName);
                if (!currentFile)
                    return;
                that.setCurrentFile(currentFile);
                currentFile.showTasks();
                if (_.getViewWidth() <= _.appMaxWith) {
                    ae.nextIn();
                }
            });
        },
        enterEventDelegate: function () {
            _.addEvent(this.ui, 'mouseover', this.showIcon);
        },
        leaveEventDelegate: function () {
            _.addEvent(this.ui, 'mouseout', this.hintIcon);
        },
        showIcon: function () {
            var deleteIcon = this.getElementsByClassName('fa-close')[0];
            deleteIcon.style.display = 'inline-block';
        },
        hintIcon: function () {
            var deleteIcon = this.getElementsByClassName('fa-close')[0];
            deleteIcon.style.display = 'none';
        },
        removeMouseEvent: function () {
            _.removeEvent(this.ui, 'mouseover', this.showIcon);
            _.removeEvent(this.ui, 'mouseout', this.hintIcon);
        },
        cilckDelete: function () {
            var that = this;
            _.addEvent(this.ui, 'click', function (e) {
                var event = e || window.event;
                var target = _.getTarget(e);
                if (_.hasClass(target, 'fa-close') && target.parentNode.nodeName.toLowerCase() == 'h4') {
                    if (event.cancelBubble) {
                        event.cancelBubble = true;
                    } else {
                        event.stopPropagation();
                    }
                    var answer = confirm('\u786E\u5B9A\u5220\u9664\u6B64\u5206\u7C7B\uFF1F');
                    if (answer) {
                        var fileName = target.parentNode.lastChild.nodeValue;
                        fileName = fileName.replace(/\s*\(\d+\)$/, '');
                        var file = that.getFile(fileName);
                        var fileId = file.id;
                        that.removeFile(file);
                        var thisData = local.getItem(that.id, 'klass');
                        var oldChild = thisData.children;
                        var index = oldChild.indexOf(fileId);
                        oldChild.splice(index, 1);
                        local.modifyItem('klass', that.id, 'children', oldChild);
                        local.deleteItem('file', fileId);
                        var sum = parseInt(_.$('.sum').innerHTML);
                        sum -= file.tasks.length;
                        _.$('.sum').innerHTML = sum;
                    }
                }
            });
        },
        init: function () {
            this.clickEventDelegate();
            this.enterEventDelegate();
            this.leaveEventDelegate();
            this.cilckDelete();
        }
    };
    return { Klass: Klass };
});
console.log('list\u52A0\u8F7D\u6210\u529F');
define('list', ['util'], function (_) {
    function List() {
        this.allList = _.$('.all');
        this.doneList = _.$('.finish');
        this.undoneList = _.$('.unFinish');
        this.dates = [];
        this.switchHandler();
    }
    List.prototype = {
        constructor: List,
        showTask: function (task) {
            var date = task.date;
            var dateItem_all, dateItem_other;
            if (this.dates.indexOf(date) < 0) {
                this.dates.push(date);
                dateItem_all = this.createDateItem(date);
            } else {
                dateItem_all = this.searchDateItem(date);
            }
            var taskBlock = document.createElement('div');
            taskBlock.innerHTML = task.name;
            _.addClass(taskBlock, 'item');
            if (task.finished) {
                _.addClass(taskBlock, 'done');
            }
            dateItem_all.appendChild(taskBlock);
            task.setUI(taskBlock);
            task.init();
        },
        createDateItem: function (date) {
            var dateItem = document.createElement('div');
            var dateBlock = document.createElement('div');
            dateBlock.innerHTML = date;
            _.addClass(dateItem, 'dateItem');
            _.addClass(dateBlock, 'date');
            dateItem.appendChild(dateBlock);
            this.allList.appendChild(dateItem);
            return dateItem;
        },
        searchDateItem: function (date) {
            if (this.dates.indexOf(date) == -1)
                return;
            var dateBlock, dateItem;
            var allList = this.allList;
            var dates = allList.getElementsByClassName('date');
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
            this.doneList.innerHTML = '';
            this.undoneList.innerHTML = '';
        },
        updateBoth: function () {
            this.updateDone();
            this.updateUndone();
        },
        updateDone: function () {
            this.doneList.innerHTML = this.allList.innerHTML;
            var items = this.doneList.getElementsByClassName('item');
            for (var len = items.length, i = len - 1; i >= 0; i--) {
                var that = items[i];
                if (!that.classList.contains('done')) {
                    var parent = that.parentNode;
                    parent.removeChild(that);
                    if (parent.children.length == 1) {
                        this.doneList.removeChild(parent);
                    }
                } else {
                    _.removeClass(that, 'done');
                }
            }
        },
        updateUndone: function () {
            this.undoneList.innerHTML = this.allList.innerHTML;
            var items = this.undoneList.getElementsByClassName('item');
            for (var len = items.length, i = len - 1; i >= 0; i--) {
                var that = items[i];
                if (that.classList.contains('done')) {
                    var parent = that.parentNode;
                    parent.removeChild(that);
                    if (parent.children.length == 1) {
                        this.undoneList.removeChild(parent);
                    }
                }
            }
        },
        switchTo: function (option) {
            var option = option || 'all';
            var b_all = _.$('.task-list .b-all'), b_undone = _.$('.task-list .b-undone'), b_done = _.$('.task-list .b-done');
            if (option == 'all') {
                _.addClass(b_all, 'active');
                _.removeClass(b_done, 'active');
                _.removeClass(b_undone, 'active');
                this.allList.style.display = 'block';
                this.doneList.style.display = this.undoneList.style.display = 'none';
            } else if (option == 'undone') {
                _.addClass(b_undone, 'active');
                _.removeClass(b_all, 'active');
                _.removeClass(b_done, 'active');
                this.undoneList.style.display = 'block';
                this.allList.style.display = this.doneList.style.display = 'none';
            } else {
                _.addClass(b_done, 'active');
                _.removeClass(b_undone, 'active');
                _.removeClass(b_all, 'active');
                this.doneList.style.display = 'block';
                this.allList.style.display = this.undoneList.style.display = 'none';
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
        switchHandler: function () {
            var that = this;
            _.addEvent(_.$('.task-list ul'), 'click', function (e) {
                var event = e || window.event;
                var target = _.getTarget(event);
                var cName = target.className;
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
    };
    return { List: List };
});
console.log('file\u52A0\u8F7D\u6210\u529F');
define('file', [
    'util',
    'list',
    'appEvent'
], function (_, list, ae) {
    function File(name, id) {
        this.id = id;
        this.name = name;
        this.tasks = [];
        this.ui = null;
        this.list = new list.List();
        this.currentTask = null;
        this.parent = null;
    }
    File.prototype = {
        constructor: File,
        createUI: function () {
            var li = this.createLi('file');
            this.setUI(li);
            var h4 = li.getElementsByTagName('h4')[0];
            var textNode = document.createTextNode(this.name + '(' + this.tasks.length + ')');
            h4.appendChild(textNode);
            return li;
        },
        setUI: function (ui) {
            this.ui = ui;
        },
        setCurrentTask: function (task) {
            this.currentFile = task;
        },
        setParent: function (pa) {
            this.parent = pa;
        },
        addTask: function (task) {
            this.tasks.push(task);
            this.list.showTask(task);
            this.list.updateBoth();
            this.otherListHandler();
            this.currentTask = task;
            this.updateLength();
            task.setParent(this);
        },
        removeTask: function (task) {
            var tasks = this.tasks;
            var index = tasks.indexOf(task);
            if (index == -1)
                return;
            else {
                tasks.splice(index + 1, 1);
                this.list.deleteTask(task);
            }
        },
        updateLength: function () {
            var h4 = this.ui.getElementsByTagName('h4')[0];
            h4.lastChild.nodeValue = this.name + '(' + this.tasks.length + ')';
        },
        getTask: function (taskName) {
            var tasks = this.tasks;
            for (var i = 0, len = tasks.length; i < len; i++) {
                if (tasks[i].name == taskName) {
                    return tasks[i];
                }
            }
        },
        getTaskById: function (id) {
            var tasks = this.tasks;
            for (var i = 0, len = tasks.length; i < len; i++) {
                if (tasks[i].id == id) {
                    return tasks[i];
                }
            }
        },
        showTasks: function () {
            var that = this;
            this.list.clear();
            this.list.dates = [];
            this.tasks.forEach(function (task) {
                that.list.showTask(task);
            });
            this.list.switchTo('all');
            this.list.updateBoth();
            this.otherListHandler();
        },
        otherListHandler: function () {
            var doneItems = this.list.doneList.getElementsByClassName('item');
            var undoneItmes = this.list.undoneList.getElementsByClassName('item');
            for (var i = 0, len1 = doneItems.length; i < len1; i++) {
                var that = this;
                _.addEvent(doneItems[i], 'click', function () {
                    var itemName = this.innerHTML;
                    var task = that.getTask(itemName);
                    task.showDetail();
                    if (_.getViewWidth() <= _.appMaxWith) {
                        ae.nextIn();
                    }
                });
            }
            for (var j = 0, len2 = undoneItmes.length; j < len2; j++) {
                var that = this;
                _.addEvent(undoneItmes[j], 'click', function () {
                    var itemName = this.innerHTML;
                    var task = that.getTask(itemName);
                    task.showDetail();
                    if (_.getViewWidth() <= _.appMaxWith) {
                        ae.nextIn();
                    }
                });
            }
        },
        highLight: function () {
            _.addClass(this.ui.getElementsByTagName('h4')[0], 'active');
        },
        unHighLight: function () {
            _.removeClass(this.ui.getElementsByTagName('h4')[0], 'active');
        },
        createLi: function (type) {
            var type = type ? type : 'folder';
            var li = document.createElement('li');
            var h;
            if (type == 'folder') {
                h = document.createElement('h3');
            } else {
                h = document.createElement('h4');
            }
            var deleteIcon = document.createElement('i');
            deleteIcon.className = 'fa fa-close';
            _.addClass(h, type);
            h.appendChild(deleteIcon);
            li.appendChild(h);
            return li;
        },
        enterEventDelegate: function () {
            _.addEvent(this.ui, 'mouseover', this.showIcon);
        },
        leaveEventDelegate: function () {
            _.addEvent(this.ui, 'mouseout', this.hintIcon);
        },
        showIcon: function (e) {
            var event = e || window.event;
            if (event.cancelBubble) {
                event.cancelBubble = true;
            } else {
                event.stopPropagation();
            }
            var deleteIcon = this.getElementsByClassName('fa-close')[0];
            deleteIcon.style.display = 'inline-block';
        },
        hintIcon: function (e) {
            var event = e || window.event;
            if (event.cancelBubble) {
                event.cancelBubble = true;
            } else {
                event.stopPropagation();
            }
            var deleteIcon = this.getElementsByClassName('fa-close')[0];
            deleteIcon.style.display = 'none';
        },
        removeMouseEvent: function () {
            _.removeEvent(this.ui, 'mouseover', this.showIcon);
            _.removeEvent(this.ui, 'mouseout', this.hintIcon);
        },
        init: function () {
            this.enterEventDelegate();
            this.leaveEventDelegate();
        }
    };
    return { File: File };
});
console.log('task\u52A0\u8F7D\u6210\u529F');
define('task', [
    'util',
    'appEvent'
], function (_, ae) {
    function Task(name, date, finished, detail, id) {
        this.id = id;
        this.name = name;
        this.date = date;
        this.finished = finished;
        this.detail = detail;
        this.ui = null;
        this.parent = null;
    }
    Task.prototype = {
        constructor: Task,
        setId: function (id) {
            if (typeof id != 'number')
                return;
            else {
                this.id = id;
            }
        },
        setName: function (name) {
            if (typeof name != 'string')
                return;
            else {
                this.name = name;
            }
        },
        setDate: function (date) {
            if (typeof date != 'string')
                return;
            else {
                this.date = date;
            }
        },
        setFinished: function (finished) {
            if (typeof finished != 'boolean')
                return;
            else {
                this.finished = finished;
            }
        },
        setDetail: function (detail) {
            if (typeof detail != 'string')
                return;
            else {
                this.detail = detail;
            }
        },
        setUI: function (ui) {
            this.ui = ui;
        },
        setParent: function (pa) {
            this.parent = pa;
        },
        showDetail: function () {
            _.$('.task-name').innerHTML = this.name;
            _.$('.task-date').innerHTML = this.date;
            _.$('.detail-body').innerHTML = this.detail;
            _.$('.edit-submit').style.display = 'none';
            if (this.finished) {
                _.$('.detail-head').style.display = 'none';
            } else {
                _.$('.detail-head').style.display = 'block';
            }
            this.parent.currentTask = this;
        },
        edit: function () {
            var editName = '<input class="input-name" type="text" ';
            if (this.name) {
                editName += 'value=' + this.name;
            } else {
                editName += 'placeholder="\u8BF7\u8F93\u5165\u4EFB\u52A1\u540D\u79F0"';
            }
            editName += ' />';
            _.$('.task-name').innerHTML = editName;
            var editDate = '<input class="input-date" type=';
            if (this.date) {
                editDate += '"text" value=' + this.date;
            } else {
                editDate += '"date"';
            }
            editDate += ' />';
            _.$('.task-date').innerHTML = editDate;
            var editDetail = '<textarea class="input-detail" ';
            if (this.detail) {
                editDetail += '>' + this.detail + '</textarea>';
            } else {
                editDetail += 'palceholder="\u8BF7\u8F93\u5165\u4EFB\u52A1\u5185\u5BB9"></textarea>';
            }
            _.$('.detail-body').innerHTML = editDetail;
            _.$('.edit-submit').style.display = 'block';
        },
        submitEdit: function () {
            var name = _.$('.input-name').value, date = _.$('.input-date').value, detail = _.$('.input-detail').value;
            if (name == '') {
                alert('\u8BF7\u8F93\u5165\u4EFB\u52A1\u540D\u79F0');
            }
            if (date == '') {
                alert('\u8BF7\u8F93\u5165\u65E5\u671F');
            }
            this.name = name;
            this.date = date;
            this.detail = detail;
        },
        finishTask: function () {
            this.finished = true;
            _.addClass(this.ui, 'done');
        },
        clickHandler: function () {
            var that = this;
            _.addEvent(this.ui, 'click', function () {
                that.showDetail();
                if (_.getViewWidth() <= _.appMaxWith) {
                    ae.nextIn();
                }
            });
        },
        init: function () {
            this.clickHandler();
        }
    };
    return { Task: Task };
});
console.log('index\u52A0\u8F7D\u6210\u529F');
require([
    'util',
    'main',
    'klass',
    'file',
    'task',
    'appEvent',
    'localStorage'
], function (_, main, klass, file, task, ae, local) {
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
        var klasses = local.getKlass();
        for (var i = 0, len = klasses.length; i < len; i++) {
            var theKlass = klasses[i];
            var kName = theKlass.name, kId = theKlass.id;
            var klassObj = new klass.Klass(kName, kId);
            main.addKlass(klassObj);
            var fileIds = theKlass.children;
            for (var j = 0, len2 = fileIds.length; j < len2; j++) {
                var theFile = local.getItem(fileIds[j], 'file');
                var fileObj = new file.File(theFile.name, theFile.id);
                klassObj.addFile(fileObj);
                var taskIds = theFile.children;
                for (var k = 0, len3 = taskIds.length; k < len3; k++) {
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
        main.setCurrentKlass(dftKlass);
        dftKlass.setCurrentFile(dftFile);
        dftFile.showTasks();
        dftTask.showDetail();
        dftKlass.removeMouseEvent();
        dftFile.removeMouseEvent();
    }
    var main = new main.Main();
    init();
    _.addEvent(_.$('.task-class .addition'), 'click', function () {
        _.$('.prompt').style.display = 'block';
    });
    _.addEvent(_.$('.prompt .sure'), 'click', function () {
        var type = _.$('#select-class').value;
        var name = _.$('#class-name').value;
        if (name == '') {
            alert('\u8BF7\u586B\u5199\u4EFB\u52A1\u540D\u79F0');
        }
        if (type == 'parent') {
            var klassData = local.addItem('klass', name);
            var newKlass = new klass.Klass(name, klassData.id);
            main.addKlass(newKlass);
        } else {
            var fileData = local.addFile(main.currentKlass.id, name);
            var newFile = new file.File(name, fileData.id);
            main.currentKlass.addFile(newFile);
            newFile.showTasks();
        }
        _.$('.prompt').style.display = 'none';
        _.$('#class-name').value = '';
        _.$('#select-class').value = 'parent';
    });
    _.addEvent(_.$('.prompt .cancel'), 'click', function () {
        _.$('.prompt').style.display = 'none';
        _.$('#class-name').value = '';
        _.$('#select-class').value = 'parent';
    });
    _.addEvent(_.$('.task-list .addition'), 'click', function () {
        var currentFile = main.currentKlass.currentFile;
        if (!currentFile) {
            alert('\u8BF7\u5148\u521B\u5EFA\u5B50\u5206\u7C7B');
            return;
        } else {
            var newTask = new task.Task('', '', true, '');
            _.$('.detail-head').style.display = 'none';
            newTask.edit();
            if (_.getViewWidth() <= _.appMaxWith) {
                ae.nextIn();
            }
        }
    });
    _.addEvent(_.$('.edit-submit .save'), 'click', function () {
        var currentFile = main.currentKlass.currentFile;
        var currentTask = currentFile.currentTask;
        if (_.$('.detail-head').style.display == 'block') {
            currentFile.list.deleteTask(currentTask);
            currentTask.submitEdit();
            currentFile.list.showTask(currentTask);
            local.modifyItem('task', currentTask.id, 'name', currentTask.name);
            local.modifyItem('task', currentTask.id, 'date', currentTask.date);
            local.modifyItem('task', currentTask.id, 'detail', currentTask.detail);
            currentTask.showDetail();
        } else {
            var newTask = new task.Task('', '', false, '');
            newTask.submitEdit();
            var taskData = local.addTask(currentFile.id, newTask.name, newTask.date, newTask.finished, newTask.detail);
            newTask.setId(taskData.id);
            currentFile.addTask(newTask);
            newTask.showDetail();
            main.setSum();
        }
    });
    _.addEvent(_.$('.edit-submit .cancel'), 'click', function () {
        var currentFile = main.currentKlass.currentFile;
        var currentTask = currentFile.currentTask;
        if (currentTask) {
            currentTask.showDetail();
        } else {
            var task = new task.Task('', '', true, '');
            task.showDetail();
        }
    });
    _.addEvent(_.$('.detail-head'), 'click', function (e) {
        var target = _.getTarget(e);
        var cName = target.className;
        var currentFile = main.currentKlass.currentFile;
        var currentTask = currentFile.currentTask;
        switch (cName) {
        case 'ok fa fa-check-square-o':
            local.modifyItem('task', currentTask.id, 'finished', true);
            currentTask.finishTask();
            currentFile.list.updateBoth();
            currentFile.otherListHandler();
            this.style.display = 'none';
            break;
        case 'edit fa fa-pencil-square-o':
            currentTask.edit();
            break;
        default:
            break;
        }
    });
    _.addEvent(_.$('.back'), 'click', function () {
        ae.preIn();
    });
});
define('index', [
    'util',
    'main',
    'klass',
    'file',
    'task',
    'appEvent',
    'localStorage'
], function () {
    return;
});