/**
 * Created by xyk on 2015/6/8.
 */
(function() {
    var input = $(".key");
    var list = $(".sug");
    var suggestData;

    function getData() {
        var xhr;
        if(window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhr.open("GET", "sug_data.json", true);
        xhr.send();
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                if(xhr.status >= 200 && xhr.status <= 300) {
                    suggestData = JSON.parse(xhr.responseText);
                }
                else {
                    console.log('请求失败，响应状态：' + xhr.status);
                }
            }
        }
    }

    //根据用户输入提供词条
    function suggest() {
        getData();
        $.on(".key", "keyup", function(e) {
            var event = window.event || e;
            var key = event.keyCode;
            if(key != 38 && key != 40 && key != 13) {
                var world = input.value;
                var length = world.length;
                list.innerHTML = "";

                for (var i = 0; i < suggestData.length; i++) {
                    var that = suggestData[i];
                    if (that.indexOf(world) == 0) {
                        var item = document.createElement("li");
                        var match = that.substr(0, length);
                        var rest = that.substring(length, that.length);
                        var matchElem = document.createElement("span");
                        var restElem = document.createElement("span");
                        matchElem.innerHTML = match;
                        restElem.innerHTML = rest;
                        addClass(matchElem, "match");
                        addClass(item, "item");
                        item.setAttribute("name", that);
                        item.appendChild(matchElem);
                        item.appendChild(restElem);
                        list.appendChild(item);
                        $(".db").style.display = "block";
                    }
                }
                if (list.innerHTML == "") {
                    $(".db").style.display = "none";
                }
            } else {
                //如果按的是方向键或回车则跳入select函数
                select(event);
            }

        });
    }

    //根据上下键更换选中的词条
    function changeItem(cur) {
        var items = list.getElementsByClassName("item");
        if(cur >= 0 && cur < items.length) {
            for(var i=0; i<items.length; i++) {
                removeClass(items[i], "focus");
            }
            addClass(items[cur], "focus");
        }
    }

    //按回车时填入当前词条
    function confirm(cur) {
        var items = list.getElementsByClassName("item");
        if(cur >= 0 && cur < items.length) {
            var select = items[cur];
            var world = select.getAttribute("name");
            input.value = world;
        }
        $(".db").style.display = "none";
    }

    //选择词条
    function select(e) {
        var items = list.getElementsByClassName("item");
        var curItem;

        for(var j=0; j<items.length; j++) {
            if(hasClass(items[j], "focus")) {
                curItem = j;
                break;
            }
        }
        if(j == items.length) {
            curItem = -1;
        }

        if(items.length == 0) {
            return;
        } else {
            if(input == document.activeElement) {
                switch (e.keyCode) {
                    case 38:
                        curItem--;
                        changeItem(curItem);
                        break;
                    case 40:
                        curItem++;
                        changeItem(curItem);
                        break;
                    case 13:
                        confirm(curItem);
                        break;
                    default :
                        break;
                }
            }
        }
        //单击鼠标时填入选中的词条
        delegateEvent(list, "li", "click", function(e) {
            var src = e.target || e.srcElement;
            var world = src.getAttribute("name");
            input.value = world;
            $(".db").style.display = "none";
        });

    }
    suggest();
})();
