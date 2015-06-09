/**
 * Created by xyk on 2015/6/9.
 */
(function(){
    var left = $(".left");
    var right = $(".right");
    var leftX1 = left.offsetLeft,
        leftX2 = leftX1 + left.offsetWidth,
        leftY1 = left.offsetTop,
        leftY2 = leftY1 + left.offsetHeight;
    var rightX1 = right.offsetLeft,
        rightX2 = rightX1 + right.offsetWidth,
        rightY1 = right.offsetTop,
        rightY2 = rightY1 + right.offsetHeight;


    //�����ĳ���鿪ʼ��ק
    function startDrag() {
        delegateEvent(left, "div", "mousedown", function(e) {
            var target = e.target || e.srcElement;
            var dis = distance(e, target);
            select(target);
            draging(target, dis);
        });
        delegateEvent(right, "div", "mousedown", function(e) {
            var target = e.target || e.srcElement;
            var dis = distance(e, target);
            select(target);
            draging(target, dis);
        });
        delegateEvent(left, "div", "mouseup", function(e) {
            var target = e.target || e.srcElement;
            draged(e, target);
        });
        delegateEvent(right, "div", "mouseup", function(e) {
            var target = e.target || e.srcElement;
            draged(e, target);
        });
    }

    //�����������ڶ�ק��ľ���
    function distance(e, ele) {
        var event = window.event || e;
        var oldX = getPosition(ele).x,
            oldY = getPosition(ele).y;
        var disX = event.clientX - oldX,
            disY = event.clientY - oldY;
        var dis = {};
        dis.x = disX;
        dis.y = disY;
        return dis;
    }

    //ѡ�ж�ק��ʱ
    function select(ele) {
        addClass(ele, "move");
        var placeholder = document.createElement("div");
        addClass(placeholder, "drager");
        addClass(placeholder, "placeholder");
        ele.parentNode == left ?
            right.appendChild(placeholder) :
            left.appendChild(placeholder);
    }

    //��קʱ
    function draging(ele, dis) {
        addEvent(ele, "mousemove", function(e) {
            var event = window.event || e;
            var left = event.clientX - dis.x,
                top = event.clientY - dis.y;
            setPosition(ele, left, top);
        });
    }

    //��ק����
    function draged(e, ele) {
        var thisX = ele.offsetLeft,
            thisY = ele.offsetTop;
        var compareX = thisX + ele.offsetWidth / 2,
            compareY = thisY;
        var parent = ele.parentNode;
        var placeholder = $(".placeholder");
        parent.removeChild(ele);
        placeholder.parentNode.removeChild(placeholder);
        var newDrager = document.createElement("div");
        addClass(newDrager, "drager");
        if(parent == left) {
            if(compareX >= rightX1 && compareX <= rightX2
                && compareY >= rightY1 && compareY <= rightY2) {
                right.appendChild(newDrager);
            } else {
                left.appendChild(newDrager);
            }
        } else {
            if(compareX >= leftX1 && compareX <= leftX2
                && compareY >= leftY1 && compareY <= leftY2) {
                left.appendChild(newDrager);
            } else {
                right.appendChild(newDrager);
            }
        }
    }

    startDrag();
})();
