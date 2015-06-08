/**
 * Created by xyk on 2015/6/5.
 */
(function(){
    var imgs = $(".carousel-inner").getElementsByClassName("item");
    var num = imgs.length;
    //生成图片导航
    function indicator() {
        var indicator = document.createElement("nav");
        addClass(indicator, "indicator");
        for(var i=0; i<num; i++) {
            var circle = document.createElement("span");
            addClass(circle, "circles");
            indicator.appendChild(circle);
        }
        $(".carousel-inner").appendChild(indicator);
        var width = indicator.offsetWidth;
        var finalWitdh = parseInt(width, 10)/2 + 10;
        indicator.style.marginLeft = -finalWitdh + 'px';
        sync();
    }

    //转换图片时动画效果
    function transition(img1, img2) {
        addClass(img2, "next");
        //addClass(img1, "left");
        addClass(img2, "left");
        //img2.addEventListener("transitioned", function() {
        removeClass(img1, "left");
        removeClass(img1, "active");
        removeClass(img2, "left");
        removeClass(img2, "next");
        addClass(img2, "active");
        //}, true);
        sync();
    }

    //导航跟随轮播
    function sync() {
        var circles = $(".indicator").getElementsByClassName("circles");
        for(var i=0; i<imgs.length; i++) {
            if(hasClass(imgs[i], "active")) {
                addClass(circles[i], "current");
            } else {
                removeClass(circles[i], "current");
            }
        }
    }

    //自动轮播图片
    function carousel(order, circle, time) {
        for (var i = 0; i < imgs.length; i++) {
            if (hasClass(imgs[i], "active")) {
                var curIndex = i;
            }
        }
        if (curIndex != -1) {
            //removeClass(imgs[curIndex], "active");
            if (order) {
                if (curIndex + 1 != imgs.length) {
                    //addClass(imgs[curIndex + 1], "active");
                    transition(imgs[curIndex], imgs[curIndex+1]);
                } else {
                    if (circle) {
                        //addClass(imgs[0], "active");
                        transition(imgs[curIndex], imgs[0]);
                    } else {
                        addClass(imgs[imgs.length - 1], "active");
                    }
                }
            } else if (!order) {
                if (curIndex - 1 != -1) {
                    //addClass(imgs[curIndex - 1], "active");
                    transition(imgs[curIndex], imgs[curIndex-1]);
                } else {
                    if (circle) {
                        //addClass(imgs[imgs.length - 1], "active");
                        transition(imgs[curIndex], imgs[imgs.length-1]);
                    } else {
                        addClass(imgs[0], "active");
                    }
                }
            }
        }
        setTimeout(function() {
            carousel(order, circle, time);
        }, time);
    }

    //点击圆点调到对应图片
    function click() {
        var circles = $(".indicator").getElementsByClassName("circles");
        for(var i=0; i<circles.length; i++) {
            circles[i].index = i;
            addClickEvent(circles[i], function() {
                var that = imgs[this.index];
                var cur = $(".active");
                transition(cur, that);
            });
        }
    }

    function main() {
        indicator();
        setTimeout(function() {
            carousel(1, 1, 5000);
        }, 5000);
        click();
    }

    main();
})();