/**
 * Created by xyk on 2015/6/3.
 */
(function(){

    function main() {
        //月份输入补零
        $.on("#month", "blur", function() {
            var mon = $("#month").value;
            if(mon.length == 1) {
                $("#month").value = "0" + mon;
            }
        });
        //日输入补零
        $.on("#day", "blur", function() {
            var day = $("#day").value;
            if(day.length == 1) {
                $("#day").value = "0" + day;
            }
        });
        //点击start
        $.click(".btn", function() {
            var count = getCount();
            if(count) {
                setCount(count);
                $(".count").style.display = "block";
                refresh();
            } else {
                return false;
            }
            
        });
    }

    //每秒更新一次时间
    function refresh() {
        var sec = parseInt($(".csec").innerHTML, 10),
            min = parseInt($(".cmin").innerHTML, 10),
            hour = parseInt($(".chour").innerHTML, 10),
            day = parseInt($(".cday").innerHTML, 10);
        if(day || hour || min || sec) {
            if (sec > 0) {
                sec--;
            } else if (sec == 0 && min > 0) {
                min--;
                sec = 59;
            } else if (sec == 0 && min == 0 && hour > 0) {
                hour--;
                min = sec = 59;
            } else if (sec == 0 && min == 0 && hour == 0 && day > 0) {
                day--;
                hour = 23;
                min = sec = 59;
            }
            $(".csec").innerHTML = sec;
            $(".cmin").innerHTML = min;
            $(".chour").innerHTML = hour;
            $(".cday").innerHTML = day;
            setTimeout(refresh, 1000);
        } else {
            alert("The time is coming!");
        }
    }

    

    //填倒计时
    function setCount(time) {
        var year = $("#year").value;
        var month = $("#month").value;
        var day = $("#day").value;
        $(".year").innerHTML = year;
        $(".month").innerHTML = month;
        $(".day").innerHTML = day;
        if(time) {
            $(".cday").innerHTML = time.day;
            $(".chour").innerHTML = time.hour;
            $(".cmin").innerHTML = time.min;
            $(".csec").innerHTML = time.sec;
        }     
    }

    //计算倒计时
    function getCount() {
        var year = $("#year").value;
        var month = $("#month").value;
        var day = $("#day").value;
        if(month > 12 || day > 31) {
            alert('请输入合法的时间');
            return false;
        }
        var now = new Date();
        var inTime = new Date(parseInt(year, 10), parseInt(month, 10)-1, parseInt(day, 10));
        var sec = Math.round((inTime.getTime() - now.getTime())/1000);
        if(sec < 0) {
            alert('请输入未来某一时间');
            return false;
        }
        var cSec = sec % 60;
        var min = Math.floor(sec / 60);
        var cMin = min % 60;
        var hour = Math.floor(min / 60);
        var cHour = hour % 24;
        var cDay = Math.floor(hour / 24);
        var count = {
            day: cDay,
            hour: cHour,
            min: cMin,
            sec: cSec
        };
        return count;
    }

    main();
})();