/**
 * Created by xyk on 2015/6/2.
 */
(function() {
    function leval_1() {
        //检测用户输入
        $.on("#input1", "keyup", function() {
            var inputs = $("#input1").value;
            $("#input1").value = inputs.replace(/[^\u4e00-\u9fa5\uFF0Ca-zA-Z\,]/g, "");
        });
        $.click("#btn1", function() {
                var inputs = $("#input1").value;
                var arr = inputs.split(",");
                $("#hobbies1").innerHTML = uniqArray(arr);
        });
    }

    function leval_2() {
        //检测用户输入
        $.on("#input2", "keyup", function() {
            var inputs = $("#input2").value;
            $("#input2").value = inputs.replace(/[^\u4e00-\u9fa5\uFF0C\u3001\uFF1Ba-zA-Z\,\;\s]/g, "");
        });
        $.click("#btn2", function() {
            var inputs  = $("#input2").value;
            var arr = inputs.split(/[\uFF0C\u3001\uFF1B\,\;\s]/g);
            $("#hobbies2").innerHTML = uniqArray(arr);
        })
    }

    function leval_3() {
        var tags = [
            "您的输入为空！",
            "请您输入少于10个兴趣爱好！"
        ];
        //检测用户输入
        $.on("#input3", "keyup", function() {
            var inputs = $("#input3").value;
            $("#input3").value = inputs.replace(/[^\u4e00-\u9fa5\uFF0C\u3001\uFF1Ba-zA-Z\,\;\s]/g, "");
        });
        $.click("#btn3", function() {
            var inputs = $("#input3").value;
            var arr = inputs.split(/[\uFF0C\u3001\uFF1B\,\;\s]/g);
            if(arr.length == 0 || inputs.length == 0) {
                $("#tag").innerHTML = tags[0];
            } else if(arr.length > 10) {
                $("#tag").innerHTML = tags[1];
            } else {
                $("#hobbies3").innerHTML = uniqArray(arr);
            }
        });
    }

    leval_1();
    leval_2();
    leval_3();

})();
