$(function () {

    var isOverTimeCom;
    var guestteamId = $("#guestteamId").val();
    if ($("#isOverTime").val() == "2") {
        timeEnd = "120+1";
        timeEndHalf = "4";
        isOverTimeCom = 2;
    } else {
        timeEnd = "FT";
        timeEndHalf = "2";
        isOverTimeCom = 1;
    }

// 比分栏
    //页面滚动显示和隐藏比分栏
    $(document).on("scroll", function () {
        var offsetTop = $(".position").offset().top;
        var scrollTop = $(document).scrollTop();
        var difference = offsetTop - scrollTop;
        if (difference < 200) {
            $(".score-bar").css({ opacity: 1 })
        } else {
            $(".score-bar").css({ opacity: 0 })
        }
    })

    //点击关闭比分栏
    $(".close-bar").on("click",function(){
        $(".score-bar").addClass("hide");
    })
//比分栏

// 球员站位、数据对比模块s
    // 球员站位、数据对比切换
    $("#tab1").on("click", "li", function () {
        $(this).addClass("tab-selected").siblings().removeClass("tab-selected");
        var dataValue = $(this).data("value");
        $("#" + dataValue).removeClass("hide").siblings("div").addClass("hide");
    })

    // 球员站位->首发站位、平均站位、攻防无线切换
    var flag = null;
    var timer;
    $("#tab11").on("click", "li", function () {

        $(this).addClass("type-selected").siblings().removeClass("type-selected");
        dataValue = $(this).data("value");
        $("#" + dataValue).removeClass("hide").siblings(".filter-box").addClass("hide");
        $("#" + dataValue + "-main").removeClass("hide").siblings(".main-right").addClass("hide");
        if (dataValue != flag) {
            if (dataValue == "average-position") {
                // 显示平均站位位置   
                getThePlayersAveragePositionList();
            } else if (dataValue == "average-line") {
                $(".attack-line.home").css({ "top": "22px" });
                $(".defend-line.home").css({ "bottom": "22px" });
                $(".attack-line.away").css({ "top": "22px" });
                $(".defend-line.away").css({ "bottom": "22px" });
                clearTimeout(timer);
                // 显示平均线位置 
                var attackLineHome = 38;  //根据后台传来的数据赋值，这里实验先直接赋值
                var defendLineHome = 35;  //根据后台传来的数据赋值，这里实验先直接赋值
                var attackLineAway = 33;  //根据后台传来的数据赋值，这里实验先直接赋值
                var defendLineAway = 36;  //根据后台传来的数据赋值，这里实验先直接赋值
                var realCourtHeight = 100;  //根据后台传来的数据赋值，这里实验先直接赋值  
                var picCourtHeight = 507;  //页面上球场中球场区域高度
                timer = setTimeout(function () {
                    $(".attack-line.home").css({ "top": 22 + picCourtHeight * attackLineHome / realCourtHeight + "px" }).children("span").text(attackLineHome);
                    $(".defend-line.home").css({ "bottom": 22 + picCourtHeight * defendLineHome / realCourtHeight + "px" }).children("span").text(defendLineHome);
                    $(".attack-line.away").css({ "top": 22 + picCourtHeight * attackLineAway / realCourtHeight + "px" }).children("span").text(attackLineAway);
                    $(".defend-line.away").css({ "bottom": 22 + picCourtHeight * defendLineAway / realCourtHeight + "px" }).children("span").text(defendLineAway);
                }, 100)
            } else if (dataValue == "first-lineup-position") {
                $(".court span").removeClass("out");
            }
            flag = dataValue;
        } else {
            return;
        }

    })

    // 条件筛选
    $(".filter-box ul").on("click", "li", function () {
        $(this).addClass("select").siblings().removeClass("select");
    })

    var courtWidth = $(".court").width();
    var courtHeight = $(".court").height();
    //ajax请求球员列表封装
    function getThePlayersAveragePositionList() {
        $("#home-team-players-position").html("");
        $("#away-team-players-position").html("");
        $.getJSON(
            "js/playerposition.json",
            function (result) {
                var json = eval(result);
                $.each(json, function (i, item) {
                    if (item.team == 1005) {
                        drawPerson("home-team-players-position", item.y, item.x, item.playerNumber, item.playerName, 15, item.isSubstitution, "H");
                    } else if (item.team == 1030) {
                        drawPerson("away-team-players-position", item.y, item.x, item.playerNumber, item.playerName, 15, item.isSubstitution, "G");
                    }
                });
            }
        )
    }
    // 画球员
    function drawPerson(svgId, x, y, number, name, size, isSubstitution, teamType) {

        if (teamType == "H") {//主队
            x = parseInt(x) / 1.05;
            y = courtHeight - parseInt(y) / 1.06;
            number = parseInt(number);
            var svg = Snap("#" + svgId);
            var circle = svg.paper.circle(x, y, 0).attr({ "team": teamType, "sub": teamType + isSubstitution, "name": teamType + number, "id": "s_" + teamType + number, fill: "#439942", stroke: "#439942", strokeWidth: 2 });
            var text = svg.paper.text(x, y + 5, "").attr({ "text-anchor": "middle", "sub": teamType + isSubstitution, "team": teamType, "name": teamType + number, color: "#439942" });
            circle.animate({
                r: size,
                fill: "#35aae6",	// 蓝色
                stroke: "white",
            }, 500);
            text.animate({
                color: "white"
            }, 500, function () {
                this.node.innerHTML = number;
            });
            var arr = [circle, text];
            //替补
            if (isSubstitution == 2) {
                circle.attr({ "stroke-dasharray": "3 3", });
            }

            circle.attr("fill", "#35aae5");
            text.attr("fill", "white");
            for (var i = 0; i < arr.length; i++) {
                arr[i].mouseover(function () {
                    highlight(svgId, teamType + number, teamType, 1);
                    $("#div_title_position1").html(number + " " + name + "<i></i>");
                    $("#div_title_position1").css("margin-left", x - 10);
                    $("#div_title_position1").css("margin-top", y - 47);
                    $("#div_title_position1").css("display", "block");
                    $("#div_title_position1").css("zIndex", 999);
                })
                arr[i].mouseout(function () {
                    highlight(svgId, teamType + number, teamType, 2);
                    $("#div_title_position1").css("display", "none");
                });
            }
        } else {//客队
            x = courtWidth - parseInt(x) / 1.05;
            y = parseInt(y) / 1.06;
            number = parseInt(number);
            var svg = Snap("#" + svgId);
            var circle = svg.paper.circle(x, y, 0).attr({ "team": teamType, "sub": teamType + isSubstitution, "name": teamType + number, "id": "s_" + teamType + number, fill: "#439942", stroke: "#439942", strokeWidth: 2 });
            var text = svg.paper.text(x, y + 5, "").attr({ "text-anchor": "middle", "sub": teamType + isSubstitution, "team": teamType, "name": teamType + number, color: "#439942" });
            circle.animate({
                r: size,
                fill: "#4a5266",	// 
                stroke: "white",
            }, 500);
            text.animate({
                color: "white"
            }, 500, function () {
                this.node.innerHTML = number;
            });
            var arr = [circle, text];
            //替补
            if (isSubstitution == 2) {
                circle.attr({ "stroke-dasharray": "3 3", });
            }

            circle.attr("fill", "#4a5266");
            text.attr("fill", "white");
            for (var i = 0; i < arr.length; i++) {
                arr[i].mouseover(function () {
                    highlight(svgId, teamType + number, teamType, 1);
                    $("#div_title_position2").html(number + " " + name + "<i></i>");
                    $("#div_title_position2").css("margin-left", x - 10);
                    $("#div_title_position2").css("margin-top", y - 47);
                    $("#div_title_position2").css("display", "block");
                    $("#div_title_position2").css("zIndex", 999);
                })
                arr[i].mouseout(function () {
                    highlight(svgId, teamType + number, teamType, 2);
                    $("#div_title_position2").css("display", "none");
                });
            }
        }


    }
    //鼠标移动到球员，高亮显示
    function highlight(svgId, name, teamType, tag) {
        var color;
        if (tag == 1) {
            color = "#FF5151";
        } else {
            if (teamType == "H") {//主队
                color = "#35aae5";
            } else {//客队
                color = "#4a5266";
            }
        }
        var newNode = $("[name='" + name + "']");
        $("[name='" + name + "']").remove();
        $("#" + svgId).append(newNode);
        $("#s_" + name + "").attr({ fill: color });
    }
// 球员站位、数据对比模块e


// 数据项白板s
    var matchId = 2994;
    var half = 0;
    var personId = "";
    var code = "";
    var passCode = "";
    var areaBlockedFrom = "";
    var areaBlockedTo = "";
    var draftedFrom = ""; //老版本需要字段，新版本不需要，默认为空
    var draftedTo = ""; //老版本需要字段，新版本不需要，默认为空
    var timeStart = "";
    var timeEnd = "";
    var timeStartHalf = "";
    var timeEndHalf = "";
    var isOverTime = "";

    //动态渲染主客队球员列表
    $.ajax({
        url: "http://192.168.2.6:8888/dataapi/match/position.html?ak=123456&matchId=2994&half=0",
        type: "GET",
        dataType: "json",
        success: function (result) {
            // console.log(result);
            var homePlayerHtmlStr = "";
            var homePlayerHtmlStrSub = "";
            var awayPlayerHtmlStr = "";
            var awayPlayerHtmlStrSub = "";
            $.each(result,function(index,item){
                if(item.team == "1000"){     
                    if( item.isSubstitution == "1"){
                        homePlayerHtmlStr += '<li><input type="checkbox" class="check-h check-p" value="'+item.personId+'">'+item.playerNumber+'.&nbsp;&nbsp;'+item.playerName+'</li>';             
                    }else{
                        homePlayerHtmlStrSub += '<li><input type="checkbox" class="check-h check-p" value="'+item.personId+'">'+item.playerNumber+'.&nbsp;&nbsp;'+item.playerName+'</li>';                       
                    }              
                }else{
                    if( item.isSubstitution == "1"){
                        awayPlayerHtmlStr += '<li><input type="checkbox" class="check-a check-p" value="'+item.personId+'">'+item.playerNumber+'.&nbsp;&nbsp;'+item.playerName+'</li>';     
                    }else{
                        awayPlayerHtmlStrSub += '<li><input type="checkbox" class="check-a check-p" value="'+item.personId+'">'+item.playerNumber+'.&nbsp;&nbsp;'+item.playerName+'</li>';                    
                    }   
                }
            })
            $(".lv1st-list.first-team-home").html(homePlayerHtmlStr);
            $(".lv1st-list.sub-home").html(homePlayerHtmlStrSub);
            $(".lv1st-list.first-team-away").html(awayPlayerHtmlStr);
            $(".lv1st-list.sub-away").html(awayPlayerHtmlStrSub);
        },
        error: function (result) {
            console.log(result);
        }
    })

    // 数据项事件选择列表
    // 二级选项表展开
    $(".lv1st-list").on("click", ".lv1", function () {
        var value = $(this).data("value");
        $(this).next("ul").toggle();
    })
    // 动作选择框点击事件
    var lastCheckedName = "";
    $(".list-menu .lv1st-list").on("click", "input", function (event) {
        event.stopPropagation();
        var name = $(this).attr("name");
        var trueTime = 0;
        var flag = 0;
        if($(this).hasClass("passes")){
            // 传球全选全不选
            if ($(this).attr('checked') && $(this).hasClass("lv1-check")) {
                $("input[name='check-passes'].lv2-check.passes").attr("checked", "checked");
                $("input[name!='check-passes'].lv2-check.passes").attr("checked", false);
                $(".event-start ul").children(".all").addClass("select").siblings().removeClass("select");
                $(".event-end ul").children(".all").addClass("select").siblings().removeClass("select");
                trueTime = 2;
                flag = 2;
            } else if(!$(this).attr('checked') && $(this).hasClass("lv1-check")){
                $("input[name='check-passes'].lv2-check.passes").attr("checked", false);
                $("input[name!='check-passes'].lv2-check.passes").attr("checked", false);
                $(".event-start ul").children(".all").addClass("select").siblings().removeClass("select");
                $(".event-end ul").children(".all").addClass("select").siblings().removeClass("select");
                trueTime = 0;
            }
            // 传球子选项
            if ($(this).hasClass("lv2-check passes") && name == "check-passes") {             
                $(".lv2-check[name='check-passes']").each(function (i, v) {
                    if (v.checked == true) {
                        trueTime++;                  
                    }
                });    
            }
            if($(this).hasClass("lv2-check passes")){
                $(".lv2-check.passes").each(function (i, v) {
                    if (v.name != name) {
                        v.checked = false;         
                    }        
                });
                if( name != "check-passes" ){
                    trueTime = 0;
                }
                if( lastCheckedName != name ){
                    $(".event-start ul").children(".all").addClass("select").siblings().removeClass("select");
                    $(".event-end ul").children(".all").addClass("select").siblings().removeClass("select");
                }
            }
            if (trueTime == $(".lv2-check[name='check-passes']").length) {
                $(".lv1-check.passes").attr("checked", true);
            } else {
                $(".lv1-check.passes").attr("checked", false);
            }

            // 如果至少有一个传球子选项被选中，区域结束块可用
            $(".lv2-check.passes").each(function (i, v) {
                if (v.checked == true) {
                    flag++;                  
                }
            });    
            if(flag != 0){
                $(".event-end").removeClass("disabled");
            }else{
                $(".event-end ul").children(".all").addClass("select").siblings().removeClass("select");
                $(".event-end").addClass("disabled");
            }
            lastCheckedName = name;
        }else{
            // 全选全不选
            if ($(this).attr('checked')) {
                $(this).parent().next().children().children("input").attr("checked", "checked");
                // 如果选中的是地面对抗
                if($("#ground_duel").attr("checked")){
                    $("#dribbles_check").attr("checked",true);
                    $("#tackles_check").attr("checked",true);      
                }
            } else {
                $(this).parent().next().children().children("input").attr("checked", false);
                // 如果取消选中的是地面对抗
                if(!$("#ground_duel").attr("checked")){
                    $("#dribbles_check").attr("checked",false);
                    $("#tackles_check").attr("checked",false);      
                }
            }
            // 子选项
            var name = $(this).attr("name");
            if ($(this).hasClass("lv2-check")) {
                var trueTime = 0;
                $(".lv2-check." + name).each(function (i, v) {
                    if (v.checked == true) {
                        trueTime++;
                        if (trueTime == $(".lv2-check." + name).length) {
                            $(this).parent().parent().prev().children().attr("checked", true);
                        } else {
                            $(this).parent().parent().prev().children().attr("checked", false);
                        }
                    }
                });
            }
            // 如果选中的是地面对抗
            if($(this).val() == "357"){
                if($(this).attr("checked")){
                    $("#dribbles_check").attr("checked",true);
                    $("#tackles_check").attr("checked",true);
                }else{
                    $("#dribbles_check").attr("checked",false);
                    $("#tackles_check").attr("checked",false);
                }      
            }
        }
        
        getChalkBoardAjax();
    })

    // 主队点击全选
    $(".home-player-list").on("click", "input", function (event) {
        // 全选全不选
        if ($(this).hasClass("check-all-h") && $(this).attr('checked')) {
            $(".check-h").attr("checked", "checked");
        } else if ($(this).hasClass("check-all-h") && !$(this).attr('checked')) {
            $(".check-h").attr("checked", false);
        } else {
            var trueTime = 0;
            $(".check-h").each(function (i, v) {
                if (v.checked == true) {
                    trueTime++;
                    if (trueTime == $(".check-h").length) {
                        $(".check-all-h").attr("checked", true);
                    } else {
                        $(".check-all-h").attr("checked", false);
                    }
                }
            });
        }
        getChalkBoardAjax();
    })
    // 客队点击全选
    $(".away-player-list").on("click", "input", function (event) {
        // 全选全不选
        if ($(this).hasClass("check-all-a") && $(this).attr('checked')) {
            $(".check-a").attr("checked", "checked");
        } else if ($(this).hasClass("check-all-a") && !$(this).attr('checked')) {
            $(".check-a").attr("checked", false);
        } else {
            var trueTime = 0;
            $(".check-a").each(function (i, v) {
                if (v.checked == true) {
                    trueTime++;
                    if (trueTime == $(".check-a").length) {
                        $(".check-all-a").attr("checked", true);
                    } else {
                        $(".check-all-a").attr("checked", false);
                    }
                }
            });
        }
        getChalkBoardAjax();
    })

    // ----选区切换
    $(".area-filter-box .area-start").on("click", "li", function () {
        if (!$(this).parent().parent().hasClass("disabled") && $(this)[0].className != "") {
            $(this).addClass("select").siblings().removeClass("select");
            getChalkBoardAjax();
        }
    });

// 时间段选择工具START
    var _move = false;
    var _x1;
    var _x2;
    var x1;
    var x2;
    var minute = 100;    //比赛时长，根据后台传回的数据赋值
    var step = 600 / minute;
    var zIndex = 1;

    // 点击上半场下半场自动选择区间
    $(".first-half").on("click",function(){
        $(".slider-left").css({ left: "-10px" }).text(0).attr("value",0);;
        $(".slider-right").css({ right: step * 50 - 10 }).text("45").attr("value","45+");
        $(".inner-bar").css({ left: 0,right: step * 50 });
        half = 1;
        getChalkBoardAjax();
    })
    $(".second-half").on("click",function(){
        $(".slider-left").css({ left: step * 50 - 10 }).text("45").attr("value","45+");
        $(".slider-right").css({ right: "-10px"}).text("90").attr("value","90+");
        $(".inner-bar").css({ left: step * 50,right: 0 });
        half = 2;
        getChalkBoardAjax();
    })

    // 滑块滑动
    $(".slider-right").text("90");
    $(".slider-left").unbind("mousedown");
    $(".slider-left").mousedown(function (e) {
        $(".slider-left").addClass("focus");
        zIndex++;
        $(".slider-left").css("zIndex", zIndex)
        var _this = $(".slider-left");
        if (!_move) {
            _move = true;
            _x1 = e.pageX - parseInt(_this.css("left"));
        } else {
            _move = false;
        }
        $(document).unbind("mousemove");
        $(document).mousemove(function (e) {
            var _this = $(".slider-left");
            var sliderRightX = parseFloat($(".slider-right").css("left"));
            if (_move) {
                x1 = e.pageX - _x1;
                if (x1 < -10) {
                    x1 = -10;
                } else if (x1 > sliderRightX + 10 - step) {
                    x1 = sliderRightX + 10 - step;
                }
                var steps = Math.round(x1 / step);
                if (steps < 0) {
                    steps = 0;
                }
                $(".slider-left").text(steps).attr("value",steps);
                if(steps > 45 && steps <= 50){
                    $(".slider-left").text("45").attr("value","45+");
                }else if(steps >50 && steps <= 95){
                    $(".slider-left").text(steps-5).attr("value",steps-5);
                }else if(steps > 95 && steps <= 100){
                    $(".slider-left").text("90").attr("value","90+");
                }              
                _this.css({ left: steps * step - 10 });
                $(".inner-bar").css({ left: steps * step });              
            }
        }).mouseup(function () {
            var _this = $(".slider-left");
            _move = false;
            $(".slider-left").removeClass("focus");
            half= 0;
            getChalkBoardAjax();
            $(document).unbind("mouseup");
        });
    });
    $(".slider-right").unbind("mousedown");
    $(".slider-right").mousedown(function (e) {
        $(".slider-right").addClass("focus");
        zIndex++;
        $(".slider-right").css("zIndex", zIndex)
        var _this = $(".slider-right");
        if (!_move) {
            _move = true;
            _x2 = e.pageX - parseFloat(_this.css("left"));

        } else {
            _move = false;
        }
        $(document).unbind("mousemove");
        $(document).mousemove(function (e) {
            var _this = $(".slider-right");
            var sliderLeftX = parseFloat($(".slider-left").css("left"));
            if (_move) {
                x2 = 600 - (e.pageX - _x2);
                if (x2 < -10) {
                    x2 = -10;
                } else if (x2 > 590 - sliderLeftX - step) {
                    x2 = 590 - sliderLeftX - step;
                }
                var steps = Math.round(x2 / step);
                if (steps < 0) {
                    steps = 0;
                }
                $(".slider-right").text(minute - steps).attr("value",minute - steps);
                if(steps >= 50 && steps <= 55){
                    $(".slider-right").text("45").attr("value","45+");
                }else if(steps >55){
                    $(".slider-right").text(minute - steps).attr("value",minute - steps);
                }else if(steps >= 0 && steps < 5){
                    $(".slider-right").text("90").attr("value","90+");
                }else if(steps >= 5 && steps < 50){
                    $(".slider-right").text(minute - steps -5).attr("value",minute - steps -5);
                }
                _this.css({ right: steps * step - 10 });
                $(".inner-bar").css({ right: steps * step })
            }
        }).mouseup(function () {
            var _this = $(".slider-right");
            _move = false;
            $(".slider-right").removeClass("focus");
            half = 0;
            getChalkBoardAjax();
            $(document).unbind("mouseup");
        });
    });
// 时间段选择工具END

// matchId,half,personId,code,areaBlockedFrom,draftedFrom,timeStart,timeEnd,timeStartHalf,timeEndHalf,isOverTime
    // 请求白板数据封装
    function getChalkBoardAjax(){
        //获取personId

        //获取personId
        personId = "";
        $(".check-p").each(function(){
            if($(this).attr("checked")){
                if(personId == ""){
                    personId += "'" +$(this).val()+"'";
                }else{
                    personId += "," +"'"+$(this).val()+"'";
                }            
            }
        })
        console.log(personId)
        //获取code
        code = "";
        $(".list-menu .lv2nd-list input").each(function(){
            if(!$(this).hasClass("passes") &&  $(this).attr("checked")){
                if(code == ""){
                    code += "'" +$(this).val()+"'";
                }else{
                    code += "," +"'"+$(this).val()+"'";
                }            
            }
        })
        // 过人成功和过人失败
        if (code.indexOf("171") > 0) {
            code = code.replace(/171/g, "86','172");
        }
        // 抢断成功和抢断失败
        if (code.indexOf("358") > 0) {
            code = code.replace(/358/g, "26','350");
        }
        // 空中对抗
        if (code.indexOf("356") > 0) {
            code = code.replace(/356/g, "61','400");
        }
        // 失误=失误+控球失误
        if (code.indexOf("412") > 0) {
            code = code.replace(/412/g, "66','412");
        }
        //门将出击成功和门将出击失败
        if (code.indexOf("359") > 0) {
            code = code.replace(/359/g, "352','353");
        }
        //如果选择了红牌或黄牌，则需要加上黄牌变红牌的代码
        if(code.indexOf("24") > 0 || code.indexOf("25") > 0){
            code += ",'117'";
        }
        //如果选择进球，则将乌龙球加入进去
        if(code.indexOf("1") > -1){
            var codestr = code.split(",");
            for ( var i = 0; i < codestr.length; i++) {
                if ("'1'" == codestr[i]) {
                    code += ",'87'";
                }
            }
        }
        console.log(code)
        //获取passCode
        passCode = "";
        $(".list-menu .lv2-check.passes").each(function(){
            if( $(this).attr("checked")){
                if(passCode == ""){
                    passCode += "'" +$(this).val()+"'";
                }else{
                    passCode += "," +"'"+$(this).val()+"'";
                }            
            }
        })    
        //接球
        if($("#check_recive").attr("checked")){
            passCode="505";
        }
        console.log(passCode)
        // 获取时间区间timeStart,timeEnd
        if($(".slider-left").attr("value") == "45+"){
            timeStart = 451;
        }else if($(".slider-left").attr("value") == "90+"){
            timeStart = 902;
        }else{
            timeStart = $(".slider-left").attr("value");
        }
        if($(".slider-right").attr("value") == "45+"){
            timeEnd = 451;
        }else if($(".slider-right").attr("value") == "90+"){
            timeEnd = 902;
        }else{
            timeEnd = $(".slider-right").attr("value");
        }

        // 获取上下半场区间timeStartHalf,timeEndHalf
        var sliderLeftCssLeft = $(".slider-left").css("left");
        if(parseInt(sliderLeftCssLeft) >= 290){
            timeStartHalf = "2";
        }else{
            timeStartHalf = "1";
        }
        var sliderRightCssRight = $(".slider-right").css("right");
        if(parseInt(sliderRightCssRight) < 290){
            timeEndHalf = "2";
        }else{
            timeEndHalf = "1";
        }

        // 获取选择事件发生和结束区域areaBlockedFrom
        // 发生区域
        var selectedLiClassNameS = $(".event-start li[class*='select']").attr("class").split(" ")[0];
        switch (selectedLiClassNameS) {
            case "all":
                areaBlockedFrom = "areaForm26,areaForm25,areaForm3,areaForm4,areaForm5,areaForm6,areaForm7,areaForm8,areaForm9,areaForm10,areaForm11,areaForm12,areaForm13,areaForm14,areaForm15,areaForm16,areaForm17,areaForm18,areaForm19,areaForm20,areaForm21,areaForm22,areaForm23,areaForm24";
                break;
            case "left":
                areaBlockedFrom = "areaForm26,areaForm25,areaForm3,areaForm7,areaForm8,areaForm9,areaForm13,areaForm14,areaForm15,areaForm19,areaForm20,areaForm21";
                break;
            case "right":
                areaBlockedFrom = "areaForm4,areaForm10,areaForm11,areaForm5,areaForm6,areaForm12,areaForm16,areaForm17,areaForm18,areaForm22,areaForm23,areaForm24";
                break;
            case "center":
                areaBlockedFrom = "areaForm3,areaForm4,areaForm9,areaForm10,areaForm15,areaForm16,areaForm21,areaForm22";
                break;
            case "top":
                areaBlockedFrom = "areaForm26,areaForm25,areaForm3,areaForm4,areaForm5,areaForm6";
                break;
            case "bottom":
                areaBlockedFrom = "areaForm19,areaForm20,areaForm21,areaForm22,areaForm23,areaForm24";
                break;
            case "middle":
                areaBlockedFrom = "areaForm7,areaForm8,areaForm13,areaForm14,areaForm9,areaForm15,areaForm10,areaForm16,areaForm11,areaForm17,areaForm12,areaForm18";
                break;
        }
        // 结束区域areaBlockedTo
        var selectedLiClassNameE = $(".event-end li[class*='select']").attr("class").split(" ")[0];
        switch (selectedLiClassNameE) {
            case "all":
                areaBlockedTo = "areaTo26,areaTo25,areaTo3,areaTo4,areaTo5,areaTo6,areaTo7,areaTo8,areaTo9,areaTo10,areaTo11,areaTo12,areaTo13,areaTo14,areaTo15,areaTo16,areaTo17,areaTo18,areaTo19,areaTo20,areaTo21,areaTo22,areaTo23,areaTo24";
                break;
            case "left":
                areaBlockedTo = "areaTo26,areaTo25,areaTo3,areaTo7,areaTo8,areaTo9,areaTo13,areaTo14,areaTo15,areaTo19,areaTo20,areaTo21";
                break;
            case "right":
                areaBlockedTo = "areaTo4,areaTo10,areaTo11,areaTo5,areaTo6,areaTo12,areaTo16,areaTo17,areaTo18,areaTo22,areaTo23,areaTo24";
                break;
            case "center":
                areaBlockedTo = "areaTo3,areaTo4,areaTo9,areaTo10,areaTo15,areaTo16,areaTo21,areaTo22";
                break;
            case "top":
                areaBlockedTo = "areaTo26,areaTo25,areaTo3,areaTo4,areaTo5,areaTo6";
                break;
            case "bottom":
                areaBlockedTo = "areaTo19,areaTo20,areaTo21,areaTo22,areaTo23,areaTo24";
                break;
            case "middle":
                areaBlockedTo = "areaTo7,areaTo8,areaTo13,areaTo14,areaTo9,areaTo15,areaTo10,areaTo16,areaTo11,areaTo17,areaTo12,areaTo18";
                break;
        }

        // 拖拽区域选择draftedFrom,draftedTo
        draftedFrom = ""; //老版本需要字段，新版本不需要，默认为空
        draftedTo = ""; //老版本需要字段，新版本不需要，默认为空
        // 是否加时赛
        isOverTime = 0;

        $("#chalk-board").empty();
        var m2 = getMarkerArrow1("chalk-board");

        if(personId != "" && code != ""){
            $.ajax({
                url: "http://192.168.2.6:8888/dataapi/match/trace.html?ak=123456&matchId="+matchId +"&half="+half+"&personId="+personId+"&code="+code+"&areaBlockedFrom="+areaBlockedFrom+"&draftedFrom="+draftedFrom+"&timeStart="+timeStart+"&timeEnd="+timeEnd+"&timeStartHalf="+timeStartHalf+"&timeEndHalf="+timeEndHalf+"&isOverTime="+isOverTime,
                type: "GET",
                dataType: "json",
                success: function (result) {
                    console.log(result);
                    var json = eval(result);
                    json = $.map(json, function(item){
                        item.x = item.x * 1.05305;
                        item.y = item.y * 1.05755;
                        return item;
                    });
                    $.each(json, function(i, item) {

                        if(!item.code){
                            return true;
                        }
                        var teamType = "H";
                        
                        if(item.teamId == guestteamId){
                            teamType = "G";
                        }
                        if(item.codeType==1||item.codeType==5){//进攻
                            if(item.code!="555"){//落球点除外
                                $.each(json, function(j, item555) {
                                    if(item.groupNo == item555.groupNo && item555.code==555){
                                        drawLineEnd("chalk-board",m2,item.x, item.y,item555.x, item555.y,item.teamId,item555.teamId,"1","2",item.code,item.groupNo,null);//后面person1和person2不一样，就为实线
                                    }
                                });
                                if(item.code == 1 || item.code == 87){
                                    drawGoal("chalk-board", item.half,item.x, item.y,json[i+1]["x"], item.personNumber,item.personName,item.groupNo,item.eventTimeNum,item.actionName,teamType,null)
                                }else{
                                    drawAttack("chalk-board", item.half,item.x, item.y, item.personNumber,item.personName,10,teamType,item.groupNo,item.eventTimeNum,item.code,item.actionName,null);
                                }
                            }
                        }else if(item.codeType==2 &&  item.code != ""){//防守
                            if(item.code ==204 ||item.code ==205 ||item.code ==502 ){//阻断传球，阻断射门，守门员扑球，需要显示线路
                                $.each(json, function(j, itemDefend) {
                                    if(item.groupNo == itemDefend.groupNo && isEmpty(itemDefend.code)){
                                        drawPersonBlock("chalk-board",itemDefend.personNumber,itemDefend.x,itemDefend.y,item.personNumber,item.x,item.y,itemDefend.teamId);
                                        return false;
                                    }
                                });
                            }
                            drawyTriangle("chalk-board",item.half, item.x, item.y, item.personNumber,item.personName,teamType,item.groupNo,item.eventTimeNum,item.code,item.actionName);
                        }else if(item.codeType==4 && item.code!=22){//犯规
                            var foulsPerson="";
    
                            if(item.code ==21 ){//需要显示被犯规人
                                $.each(json, function(k, itemFoul) {
                                    if(item.groupNo == itemFoul.groupNo && itemFoul.code==22){
                                        foulsPerson =itemFoul.personNumber+" "+itemFoul.personName;
                                        return false;
                                    }
                                });
                            }
                            drawyRect("chalk-board", item.half,item.x, item.y, item.personNumber,item.personName,teamType,item.eventTimeNum,item.code,item.actionName,item.groupNo,foulsPerson);
                        } else if(item.codeType==6){//对抗
                            drawDuels("chalk-board", item.half,item.x, item.y, item.personNumber,item.personName,teamType,item.eventTimeNum,item.code,item.actionName,item.groupNo);
                        }
                        else if(item.codeType==7){//其他
                            drawShift("chalk-board",item.half, item.x, item.y, item.personNumber,item.personName,teamType,item.eventTimeNum,item.code,item.actionName);
                        }
                        
                        //timeline
                        // var codeType=item.codeType;
                        // if(item.code == 1 || item.code == 87){
                        //     codeType="goal";
                        // }
                        // if(item.code !=555 && item.code !=22 && isNotEmpty(item.code)){//空，落球点，被犯规 不需要在时间轴上显示
                        //     var nextX = null;
                        //     if(json[i+1]){
                        //         nextX = json[i+1]["x"];
                        //     }
                        //     if (isOverTimeCom == "2") {
                        //         cbTimeLine(item.half,item.eventTimeNum*0.82,item.x,item.y,nextX,codeType,item.code,item.personNumber,item.personName,item.eventTimeFull,teamType,item.actionName);
                        //     } else {
                        //         cbTimeLine(item.half,item.timeNum,item.x,item.y,nextX,codeType,item.code,item.personNumber,item.personName,item.eventTimeFull,teamType,item.actionName);
                        //     }
                        // }
                    });
                },
                error: function (result) {
                    console.log(result);
                }
            })
        }  

        if(personId != "" && passCode != ""){
            $.ajax({
                url: "http://192.168.2.6:8888/dataapi/match/tracePass.html?ak=123456&matchId="+matchId +"&half="+half+"&personId="+personId+"&passCode="+passCode+"&areaBlockedFrom="+areaBlockedFrom+"&areaBlockedTo="+areaBlockedTo+"&draftedFrom="+draftedFrom+"&draftedTo="+draftedTo+"&timeStart="+timeStart+"&timeEnd="+timeEnd+"&timeStartHalf="+timeStartHalf+"&timeEndHalf="+timeEndHalf+"&isOverTime="+isOverTime,
                type: "GET",
                dataType: "json",
                success: function (result) {
                    console.log(result);
                    var json = eval(result);
                    json = $.map(json, function(item){
                        item.x = item.x * 1.05305;
                        item.y = item.y * 1.05755;
                        item.personFromX = item.personFromX * 1.05305;
                        item.personToX = item.personToX * 1.05305;
                        item.personFromY = item.personFromY * 1.05755;
                        item.personToY = item.personToY * 1.05755;
                        return item;
                    });


                    $.each(json, function(i, item) {
                        //画传球线路
                        drawPassInChalkBoard("chalk-board",item.groupNo,item.personFromNum,item.personFromX,item.personFromY,item.personToNum,item.personToX,item.personToY,item.fromTeamId,item.toTeamId,item.fromTime);
                    });

                    
                },
                error: function (result) {
                    console.log(result);
                }
            })
        }


    }
    
    //进球
    function drawGoal(svgId,half,x,y,x2,number,name,groupNo,eventTimeFull,actionName,teamType,istrace){
        var svg = Snap("#"+svgId);

        var goalType = "GOAL";
        
        if((teamType=="H" && x2<310)||(teamType=="G" && x2>310)){//乌龙球
            goalType = "OWN";
        }
        var id = "s_"+half.toString()+x.toString()+y.toString()+number.toString();
        var image = svg.paper.image("images/icon_"+goalType+".png", x-10, y-10, 20, 20).attr({"name":half.toString()+x.toString()+y.toString()+number.toString(),"id":id,"cursor":"hand"});

        image.dblclick(function(){
            playMedia(groupNo);
        });
        if(isNotEmpty(istrace)){
            image.attr("istrace",istrace);
        }
        var hammerImage = new Hammer(document.getElementById(id));
        hammerImage.on("doubletap", function(ev) {
            playMedia(groupNo);
        });
        image.click(function(){
            darken(svgId);
            //画进攻轨迹
            traceLine(groupNo);
            $("#currentGroupId").val(groupNo);
            $("#actionTime").val(eventTimeFull);
        });
        image.mouseover(function() {
            highlight(svgId,half+""+x+""+y+""+number,teamType,1); 
            $("#div_title_trace").html(number+" "+name+" "+eventTimeFull+" "+actionName);
            $("#div_title_trace").css("margin-left",x-20);
            $("#div_title_trace").css("margin-top",y-40);
            $("#div_title_trace").css("display","block");
        });
        image.mouseout(function() {
            highlight(svgId,half+""+x+""+y+""+number,teamType,2); 
            $("#div_title_trace").css("display","none");
        });
        
    }

    //进攻
    function drawAttack(svgId,half,x,y,number,name,size,teamType,groupNo,eventTimeFull,code,actionName,istrace){
        x= parseInt(x);
        y= parseInt(y);
        number= parseInt(number);
        var svg = Snap("#"+svgId);
        //界外球显示在一条线上
        //x:40 580
        //y:28 389
        //新球场界限
        //x:40*1.05305 580*1.05305
        //y:28*1.05755 389*1.05755
        if(code==19){
            if(y<28*1.05755){
                y=18*1.05755;
            }
            if(y>389*1.05755){
                y=399*1.05755;
            }
        }
        var circleId = "s_"+half.toString()+x.toString()+y.toString()+number.toString();
        var textId ="t_"+circleId;
        var circle = svg.paper.circle(x, y, size).attr({"name":half.toString()+x.toString()+y.toString()+number.toString(),"id":circleId,"cursor":"hand","stroke":colorMap.get(code+""),"stroke-width":"2"});
        var text = svg.paper.text(x, y+5, number).attr({"name":half.toString()+x.toString()+y.toString()+number.toString(),"id":textId,"text-anchor":"middle","font-size":size ,"cursor":"hand"});
        
        if(isNotEmpty(istrace)){
            circle.attr("istrace",istrace);
            text.attr("istrace",istrace);
        }
        
        //过人失败(虚线显示)
        if(code==172){
            circle.attr("stroke-dasharray","3 3");
        }
        
        if(teamType=="H"){//主队
            circle.attr("fill", "#3C7994");
            text.attr("fill","white");
        }else{//客队
            circle.attr("fill", "#DCF2FE");
            text.attr("fill","black");
        }
        text.click(function(){
            $("#currentGroupId").val(groupNo);
            $("#actionType").val(1);
            $("#actionTime").val(eventTimeFull);
            darken(svgId);
            //画进攻轨迹
            traceLine(groupNo);
            
        });
        circle.click(function(){
            $("#currentGroupId").val(groupNo);
            $("#actionType").val(1);
            $("#actionTime").val(eventTimeFull);
            darken(svgId);
            //画进攻轨迹
            traceLine(groupNo);
        });
        circle.dblclick(function(){
            playMedia(groupNo);
        });
        text.dblclick(function(){
            playMedia(groupNo);
        });
        var circleHammer = new Hammer(document.getElementById(circleId));
        circleHammer.on("doubletap", function(ev) {
            playMedia(groupNo);
        });
        var textHammer = new Hammer(document.getElementById(textId));
        textHammer.on("doubletap", function(ev) {
            playMedia(groupNo);
        });
        
        text.mouseover(function() {
            highlight(svgId,half+""+x+""+y+""+number,teamType,1); 
            $("#div_title_trace").html(number+" "+name+" "+eventTimeFull+" "+actionName);
            $("#div_title_trace").css("margin-left",x-20);
            $("#div_title_trace").css("margin-top",y-40);
            $("#div_title_trace").css("display","block");
        });
        text.mouseout(function() {
            highlight(svgId,half+""+x+""+y+""+number,teamType,2); 
            $("#div_title_trace").css("display","none");
        });
    }

    //防守，三角形
    function drawyTriangle(svgId,half,x,y,number,name,teamType,groupNo,eventTimeFull,code,actionName){
        var docName = "pb"+number+"_"+x+"_"+y;
        // 	half.toString()+x.toString()+y.toString()+number.toString()
        x= parseInt(x);
        y= parseInt(y);
        number= parseInt(number);
        var svg = Snap("#"+svgId);
        var polySize=10;
        var poly = svg.paper.polygon([x,y-polySize ,x-polySize,y+polySize ,x+polySize,y+polySize]).attr({"name":docName,"id":"s_"+half.toString()+x.toString()+y.toString()+number.toString(),"stroke":colorMap.get(code+""),"stroke-width":"2"});
        var text = svg.paper.text(x, y+8, number).attr({"name":docName,"text-anchor":"middle" });
        
        // 抢断失败和门将出击失败(显示虚线)
        if(code==350 || code==353){
            poly.attr("stroke-dasharray","3 3");
        }
        
        if(teamType=="H"){//主队
            poly.attr("fill", "#3C7994");
            text.attr("fill","white");
        }else{//客队
            poly.attr("fill", "#DCF2FE");
            text.attr("fill","black");
        }
        text.mouseover(function() {
            highlight(svgId,docName,teamType,1); 
            $("#div_title_trace").html(number+" "+name+" "+eventTimeFull+" "+actionName);
            $("#div_title_trace").css("margin-left",x-20);
            $("#div_title_trace").css("margin-top",y-40);
            $("#div_title_trace").css("display","block");
            
            darkenOtherByName(svgId,docName);
        });
        text.mouseout(function() {
            highlight(svgId,docName,teamType,2); 
            $("#div_title_trace").css("display","none");
            lighten(svgId);
        });
        
        poly.dblclick(function(){
            playMedia(groupNo);
        });
        
        text.dblclick(function(){
            playMedia(groupNo);
        });
    }

    //画被防守人
    function drawPersonBlock(svgId,personFromNum,personFromX,personFromY,personToNum,personToX,personToY,teamId){
        personFromX = parseInt(personFromX);
        personFromY = parseInt(personFromY);
        personFromNum = parseInt(personFromNum);
        personToX = parseInt(personToX);
        personToY = parseInt(personToY);
        personToNum = parseInt(personToNum);
        
        var docName = "pb"+personToNum+"_"+personToX+"_"+personToY;
        
        var svg = Snap("#"+svgId);
        
        var circleFromColor;
        var textFromColor;
        
        if(teamId==hometeamId){
            circleFromColor="#3C7994";
            textFromColor="white";
        }else{//客队
            circleFromColor="#DCF2FE";
            textFromColor="black";
        }
        
        //画线
        var pathStr = drawLineArrow(personFromX,personFromY,personToX,personToY);
        var linePath = svg.paper.path(pathStr).attr({
            stroke: "red",
            strokeWidth: 1,
            "name":docName
        });
        var circleFrom = svg.paper.circle(personFromX, personFromY, 8).attr({"name":docName });
        var textFrom = svg.paper.text(personFromX, personFromY+5, personFromNum).attr({"text-anchor":"middle","name":docName });
        circleFrom.attr("fill", circleFromColor);
        textFrom.attr("fill",textFromColor);
        
        textFrom.mouseover(function(){
            darkenOtherByName(svgId,docName);
        });
        textFrom.mouseout(function() {
            lighten(svgId);
        });
    }

    //犯规 正方形
    function drawyRect(svgId,half,x,y,number,name,teamType,eventTimeFull,code,actionName,groupNo,foulsPerson){

        
        $("#actionType").val(2);
        x= parseInt(x);
        y= parseInt(y);
        number= parseInt(number);
        var svg = Snap("#"+svgId);
        var rectWidth=15;
        var rectId = "s_"+half.toString()+x.toString()+y.toString()+number.toString();
        var textId = "t_"+rectId;
        var rect = svg.paper.rect(x-rectWidth/2, y-rectWidth/2, rectWidth, rectWidth, 2).attr({"name":half.toString()+x.toString()+y.toString()+number.toString(),"id":rectId,"stroke":colorMap.get(code+""),"stroke-width":"2"});
        var text = svg.paper.text(x, y+5, number).attr({"name":half.toString()+x.toString()+y.toString()+number.toString(),"id":textId,"text-anchor":"middle"});
        
        if(teamType=="H"){//主队
            rect.attr("fill", "#3C7994");
            text.attr("fill","white");
        }else{//客队
            rect.attr("fill", "#DCF2FE");
            text.attr("fill","black");
        }
        text.dblclick(function(){
            $("#actionTime").val(eventTimeFull);
            $("#currentGroupId").val(groupNo);
            playMedia(groupNo);
        });
        var rectHammer = new Hammer(document.getElementById(rectId));
        rectHammer.on("doubletap", function(ev) {
            playMedia(groupNo);
        });
        var textHammer = new Hammer(document.getElementById(textId));
        textHammer.on("doubletap", function(ev) {
            playMedia(groupNo);
        });
        text.mouseover(function() {
            highlight(svgId,half+""+x+""+y+""+number,teamType,1); 
            if(code = 21){//如果是犯规，则显示被犯规人
                $("#div_title_trace").html(number+" "+name+" "+eventTimeFull +" "+ actionName+" "+foulsPerson);
            }else{
                $("#div_title_trace").html(number+" "+name+" "+eventTimeFull+" "+actionName);
            }
            $("#div_title_trace").css("margin-left",x-20);
            $("#div_title_trace").css("margin-top",y-40);
            $("#div_title_trace").css("display","block");
        });
        text.mouseout(function() {
            highlight(svgId,half+""+x+""+y+""+number,teamType,2);
            $("#div_title_trace").css("display","none");
        });
    }

    //对抗
    function drawDuels(svgId,half,x,y,number,name,teamType,eventTimeFull,code,actionName,groupNo,foulsPerson){

        $("#actionType").val(0);
        x= parseInt(x);
        y= parseInt(y);
        number= parseInt(number);
        var svg = Snap("#"+svgId);
        var rectWidth=15;
        var rectId = "s_"+half.toString()+x.toString()+y.toString()+number.toString();
        var textId = "t_"+rectId;
        var rect = svg.paper.rect(x-rectWidth/2, y-rectWidth/2, rectWidth, rectWidth, 2).attr({"name":half.toString()+x.toString()+y.toString()+number.toString(),"id":rectId,"stroke":colorMap.get(code+""),"stroke-width":"2"});
        var text = svg.paper.text(x, y+5, number).attr({"name":half.toString()+x.toString()+y.toString()+number.toString(),"id":textId,"text-anchor":"middle"});
        
        if(teamType=="H"  && code=="61" ){//主队空中对抗成功
            rect.attr("fill", "#3C7994");
            text.attr("fill","white");
        }
        
        if (teamType=="G" && code=="61") {//客队空中对抗成功
            rect.attr("fill", "#DCF2FE");
            text.attr("fill","black");
        }
        if(teamType=="H"  && code=="400" ){//主队空中对抗失败
            rect.attr("fill", "#3C7994");
            text.attr("fill","red");
        }
        if (teamType=="G" && code=="400") {//客队空中对抗失败
            rect.attr("fill", "#DCF2FE");
            text.attr("fill","red");
        }
        text.dblclick(function(){
            $("#actionTime").val(eventTimeFull);
            $("#currentGroupId").val(groupNo);
            playMedia(groupNo);
        });
        var rectHammer = new Hammer(document.getElementById(rectId));
        rectHammer.on("doubletap", function(ev) {
            playMedia(groupNo);
        });
        var textHammer = new Hammer(document.getElementById(textId));
        textHammer.on("doubletap", function(ev) {
            playMedia(groupNo);
        });
        text.mouseover(function() {
            highlight(svgId,half+""+x+""+y+""+number,teamType,1);
            $("#div_title_trace").html(number+" "+name+" "+eventTimeFull +" "+ actionName);
            $("#div_title_trace").css("margin-left",x-20);
            $("#div_title_trace").css("margin-top",y-40);
            $("#div_title_trace").css("display","block");
        });
        text.mouseout(function() {
            highlight(svgId,half+""+x+""+y+""+number,teamType,2);
            $("#div_title_trace").css("display","none");
        });
    }

    //球权转换
    function drawShift(svgId,half,x,y,number,name,teamType,eventTimeFull,code,actionName){
        console.log(code)

        if (code == "503") {
            x= parseInt(x);
            y= parseInt(y);
            var svg = Snap("#"+svgId);
            var text = svg.paper.text(x,y, "x").attr({"font-face":"华文新魏","text-anchor":"middle" });
            
            if(teamType=="H" && code=="503"){//球权转换主队
                text.attr("fill", "#3C7994");//3C7994
            }
            if (teamType=="G" && code=="503") {//球权转换客队
                text.attr("fill", "#DCF2FE");//DCF2FE
            }
        } else {
            var docName = "pb"+number+"_"+x+"_"+y;
            x= parseInt(x);
            y= parseInt(y);
            number= parseInt(number);
            var svg = Snap("#"+svgId);
            var polySize=10;
            console.log(colorMap.get(code+""))
            var poly = svg.paper.polygon([x-polySize, y-polySize, x, y+polySize, x+polySize, y-polySize]).attr({"name":docName,"id":"s_"+half.toString()+x.toString()+y.toString()+number.toString(),"stroke":colorMap.get(code+""),"stroke-width":"2"});
            var text = svg.paper.text(x, y, number).attr({"name":docName,"text-anchor":"middle" });
            
            if(teamType=="H"){//主队
                poly.attr("fill", "#3C7994");
                text.attr("fill","white");
            }else{//客队
                poly.attr("fill", "#DCF2FE");
                text.attr("fill","black");
            }
            text.mouseover(function() {
                highlight(svgId,docName,teamType,1); 
                $("#div_title_trace").html(number+" "+name+" "+eventTimeFull+" "+actionName);
                $("#div_title_trace").css("margin-left",x-20);
                $("#div_title_trace").css("margin-top",y-40);
                $("#div_title_trace").css("display","block");
                
                darkenOtherByName(svgId,docName);
            });
            text.mouseout(function() {
                highlight(svgId,docName,teamType,2); 
                $("#div_title_trace").css("display","none");
                lighten(svgId);
            });
        }
    }


    function drawLineEnd(svgId,m2,x1,y1,x2,y2,team1,team2,person1,person2,code,groupNo,istrace){
        var svg = Snap("#"+svgId);
        var stroke="blue";
        //老球场界限
        //x:40 580
        //y:28 389
        //新球场界限
        //x:40*1.05305 580*1.05305
        //y:28*1.05755 389*1.05755
        if(isNotEmpty(code) && code !=1){//除进球外
            if(x2<40*1.05305 || x2>580*1.05305 || y2<28*1.05755 || y2>389*1.05755){
                stroke = "red";
            }
        }
        //界外球显示在同一条线上
        if(code==19){
            if(y1<28*1.05755){
                y1=18*1.05755;
            }
            if(y1>389*1.05755){
                y1=399*1.05755;
            }
        }
        
        var line = svg.paper.line(x1+0.5, y1 ,x2+0.5, y2).attr({
            strokeWidth: 1,
            fill: "none",
            "marker-end": m2
        });
        if(team1!=team2){
            stroke="red";
        }
        if(isNotEmpty(istrace)){
            line.attr("istrace",istrace);
        }
        line.attr("stroke",stroke);
        if(person1==person2){
            line.attr("stroke-dasharray","3 3");
        }
        //角球点击线路播放动画
        if(code==14){
            line.click(function(){
                darken(svgId);
                //画进攻轨迹
                traceLine(groupNo);
            });
        }
    }

    //画数据白板传球线路
    function drawPassInChalkBoard(svgId,groupNo,personFromNum,personFromX,personFromY,personToNum,personToX,personToY,fromTeamId,toTeamId,traceTime){
        personFromX = parseInt(personFromX);
        personFromY = parseInt(personFromY);
        personFromNum = parseInt(personFromNum);
        personToX = parseInt(personToX);
        personToY = parseInt(personToY);
        personToNum = parseInt(personToNum);
        
        // $("#actionType").val(3);
        var svg = Snap("#"+svgId);
        
        var linColor="blue";
        var circleFromColor;
        var textFromColor;
        var circleToColor;
        var textToColor;
        
        if(fromTeamId==hometeamId){//主队
            circleFromColor="#3C7994";
            textFromColor="white";
            if(toTeamId==hometeamId){//主队
                circleToColor="#3C7994";
                textToColor="white";
            }else if(toTeamId==guestteamId){//客队
                circleToColor="#DCF2FE";
                textToColor="black";
                linColor="red";
            }
        }else if(fromTeamId==guestteamId){//客队
            circleFromColor="#DCF2FE";
            textFromColor="black";
            if(toTeamId==hometeamId){//主队
                circleToColor="#3C7994";
                textToColor="white";
                linColor="red";
            }else if(toTeamId==guestteamId){//客队
                circleToColor="#DCF2FE";
                textToColor="black";
            }
        }
        
        //球传到界外，线条为红色
        if((fromTeamId==toTeamId && personToNum==0)||(fromTeamId==toTeamId && personFromNum==personToNum)){
            linColor="red";
        }
        //生成唯一name号
        var passName = fromTeamId+"_pass_"+personFromNum + new Date().getTime()+Math.random();
        
        //画线
        var pathStr = drawLineArrow(personFromX,personFromY,personToX,personToY);
        var linePath = svg.paper.path(pathStr).attr({
            stroke: linColor,
            strokeWidth: 1,
            name:passName
        });
             
        //球传到界外,接球人不显示
        if((fromTeamId==toTeamId && personToNum==0)||(fromTeamId==toTeamId && personFromNum==personToNum)){
            //nothing
        }else{
            var circleTo = svg.paper.circle(personToX, personToY, 8).attr({"name":passName,"fill":circleToColor});
            var textTo = svg.paper.text(personToX, personToY+5, personToNum).attr({"text-anchor":"middle","name":passName,"fill":textToColor });
            // circleTo.attr("fill", circleToColor);
            // textTo.attr("fill",textToColor);          
            textTo.mouseover(function(){
                darken(svgId);
                $("#"+svgId+">[name='"+passName+"']").css("opacity","1");
            });
            textTo.mouseout(function() {
                lighten(svgId);
            });
            
            //播放视频
            textTo.dblclick(function(){
                playMedia(groupNo);
                $("#actionTime").val(traceTime);
                //将groupNo写入hidden中，以便截图使用
                $("#currentGroupId").val(groupNo);
            });
        }
        
        var circleFrom = svg.paper.circle(personFromX, personFromY, 8).attr("name",passName);
        var textFrom = svg.paper.text(personFromX, personFromY+5, personFromNum).attr({"text-anchor":"middle" ,"name":passName});
        circleFrom.attr("fill", circleFromColor);
        textFrom.attr("fill",textFromColor);
        
        textFrom.mouseover(function(){
            darken(svgId);
            $("#"+svgId+">[name='"+passName+"']").css("opacity","1");
        });
        textFrom.mouseout(function() {
            lighten(svgId);
        });
             
        //播放视频
        textFrom.dblclick(function(){
            playMedia(groupNo);
            $("#actionTime").val(traceTime);
            //将groupNo写入hidden中，以便截图使用
            $("#currentGroupId").val(groupNo);
        });
        
    // 	linePath.mouseover(function() {
    // 		darken(svgId);
    // 		$("#"+svgId+">[name='"+passName+"']").css("opacity","1");
    // 	});
    // 	linePath.mouseout(function() {
    // 		lighten(svgId);
    // 	});
    }

    
    function darken(svgId){
        $("#"+svgId+"> *").css("opacity","0.2");
        //截图时防止背景变黑
        $("#"+svgId+"> #trace_bg").css("opacity","1");
    }
    
    // 高亮
    function lighten(svgId){
        $("#"+svgId+"> *").css("opacity","1");
    }
    // 选中本项，其他项变暗  
    function darkenOtherByName(svgId,docName){
        darken(svgId);
        $("#"+svgId+">[name='"+docName+"']").css("opacity","1");
    }

    // console.log(translateTimeFormat( 96. + "" ))


// 数据项白板e



// 传球、进攻比例、进攻方式 模块start

    //页面加载完成绘制传球->传控网络图start1111111111111
    var homeId = 1000;  //从后台获取，暂时写死
    passNetworkDrawParper(homeId, "svg_pass_network_home_trace", "H", "");
    var awayId = 1030;  //从后台获取，暂时写死
    passNetworkDrawParper(awayId, "svg_pass_network_away_trace", "G", "");

    //按照球场长622宽416计算传球线路和球员的X坐标和Y坐标
    function passNetworkDrawParper(teamId, svg, hg, personId) {
        $("#" + svg).empty();
        // var isOverTime = $("#isOverTime").val();
        var isOverTime = 0;
        var viewType = $("li.viewType.select").val();
        var lineType = $("li.lineType.select").val();
        // var timeType = $("input[name='timeType']:checked").val();
        var timeType = 3;
        // /*var half = 0;
        // if (isOverTime ==2 ) {
        //     half = 6;
        // }*/
        var personPass;
        var personLine = ",";

        //画球员之间的传球线路和球员位置

        // $.ajax({
        //     type : "post",
        //     data : "matchId="+matchId+"&teamId="+teamId+"&viewType="+viewType+"&personId="+personId+"&half="+half+"&timeType="+timeType+"&isOverTime="+isOverTime,
        //     url : "${basePath}getNetWorkTeamPassAjax.html",
        //     success:function(da){
        $.getJSON(
            "js/getNetWorkTeamPassAjax.json",
            function (result) {
                // personPass = eval('(' + result + ')');
                personPass = result;
                var list = personPass.teamPassTraceList;
                var list1 = personPass.matchPositionList;
                $.each(list, function (i, item) {
                    var fromNumber = parseInt(item.fromPersonNumber);
                    var fromRadius = personPass[fromNumber];
                    var toNumber = parseInt(item.toPersonNumber);
                    var toRadius = personPass[toNumber];
                    if (fromRadius == '' || fromRadius == 'undefined') {
                        fromRadius = 4;
                    } else {
                        fromRadius = parseInt(fromRadius / 15) + 4;
                    }
                    if (toRadius == '' || toRadius == 'undefined') {
                        toRadius = 4;
                    } else {
                        toRadius = parseInt(toRadius / 15) + 4;
                    }
                    if (teamId == 1030 && item.passCount >= lineType) {
                        personLine = personLine + fromNumber + ",";
                        personLine = personLine + toNumber + ",";
                        if (!isNaN(personPass[toNumber])) {
                            drawLineHorizontal(svg, item.fromPersonX * 0.94, (416 - item.fromPersonY) * 0.94, item.toPersonX * 0.94, (416 - item.toPersonY) * 0.94, item.passCount, fromRadius, toRadius);
                        }
                    } else if (teamId == 1000 && item.passCount >= lineType) {
                        personLine = personLine + fromNumber + ",";
                        personLine = personLine + toNumber + ",";
                        if (!isNaN(personPass[toNumber])) {
                            drawLineHorizontal(svg, (622 - item.fromPersonX) * 0.94, item.fromPersonY * 0.94, (622 - item.toPersonX) * 0.94, item.toPersonY * 0.94, item.passCount, fromRadius, toRadius);
                        }
                    }
                });

                //画完线路之后再画球员
                $.each(list1, function (i, item) {
                    var number = parseInt(item.playerNumber);
                    var radius = item.touchBall;
                    if (radius == '' || isNaN(radius)) {
                        radius = 4;
                    } else {
                        radius = parseInt(radius / 15) + 4;
                    }
                    if (item.team == 1000) {
                        if (viewType == 1) {
                            if (item.isSubstitution == 1 || personLine.indexOf("," + number + ",") != -1) {
                                drawPersonHorizontal(svg, item.y * 0.94, 622 - item.x * 0.94, item.personId, item.playerName, item.playerName, radius, item.isSubstitution, "H", teamId, personId);
                            }
                        }
                        else {
                            drawPersonHorizontal(svg, item.y * 0.94, 622 - item.x * 0.94, item.personId, item.playerName, item.playerName, radius, item.isSubstitution, "H", teamId, personId);
                        }
                    } else if (item.team == 1030) {
                        if (viewType == 1) {
                            if (item.isSubstitution == 1 || personLine.indexOf("," + number + ",") != -1) {
                                drawPersonHorizontal(svg, (416 - item.y) * 0.94, item.x * 0.94, item.personId, item.playerName, item.playerName, radius, item.isSubstitution, "G", teamId, personId);
                            }
                        }
                        else {
                            drawPersonHorizontal(svg, (416 - item.y) * 0.94, item.x * 0.94, item.personId, item.playerName, item.playerName, radius, item.isSubstitution, "G", teamId, personId);
                        }

                    }

                });
                //统计时间
                if (hg == 'H') {
                    //$("#homeFromTime").html("1-"+personPass.fromTime+"分钟");
                    if (timeType == '3') {
                        $("#homeFromTime").html("1-" + personPass.fromTime + "分钟");
                    }

                    if (timeType == '1') {
                        $("#homeFromTime").html("1-45分钟");
                    }

                    if (timeType == '2') {
                        $("#homeFromTime").html("46-90分钟");
                    }

                    if (timeType == '0' && 　isOverTime == '2') {
                        $("#homeFromTime").html("1-120分钟");
                    }

                    if (timeType == '0' && 　isOverTime != '2') {
                        $("#homeFromTime").html("1-90分钟");
                    }

                    if (personId == '') {
                        $("#homePersonId").val("");
                        var homePersonId = $("#homePersonId").val();
                        var guestPersonId = $("#guestPersonId").val();
                        $("#home_team_title").html("平均站位和传球网络 Positions and Passing Network");
                        $("#home_person_pass").html("");
                        $("#homePassLeft").attr("style", "display:block;");
                        $("#homePassRight").attr("style", "display:block;");
                        $("#matchPersonHomePass").attr("style", "display:none;");
                        if (homePersonId == '' && guestPersonId == '') {
                            $("input:radio[name='lineType']").attr("disabled", false);
                            $("input:radio[name='viewType']").attr("disabled", false);
                        }
                    } else {
                        var personPassHtml = "";
                        var matchPersonPassList = personPass.matchPersonPassList;
                        matchPersonPassList = eval(matchPersonPassList);
                        var matchPersonPass = personPass.matchPersonPass;
                        $.each(matchPersonPassList, function (i, item) {
                            personPassHtml = personPassHtml + "<p>";
                            personPassHtml = personPassHtml + item.passCount;
                            personPassHtml = personPassHtml + " " + item.fromPersonNameEn;
                            personPassHtml = personPassHtml + "—"
                            personPassHtml = personPassHtml + item.toPersonNameEn;
                            personPassHtml = personPassHtml + "</p>"
                        });
                        $("#matchPersonHomePass").html(personPassHtml);
                        $("#home_person_pass").html(matchPersonPass.personNameEn + matchPersonPass.succPasses + "/" + matchPersonPass.passes);
                        $("#matchPersonHomePass").attr("style", "display:block;");
                        $("#homePassLeft").attr("style", "display:none;");
                        $("#homePassRight").attr("style", "display:none;");
                        var newNodec = $("[name='" + personId + "c']");
                        var newNodet = $("[name='" + personId + "t']");
                        newNodec.attr("stroke", "#6f0a0a");
                        newNodec.attr("stroke-width", "2");
                        newNodet.attr("fill", "#6f0a0a");
                    }

                }
                if (hg == 'G') {

                    if (timeType == '3') {
                        $("#guestFromTime").html("1-" + personPass.fromTime + "分钟");
                    }

                    if (timeType == '1') {
                        $("#guestFromTime").html("1-45分钟");
                    }

                    if (timeType == '2') {
                        $("#guestFromTime").html("46-90分钟");
                    }

                    if (timeType == '0' && 　isOverTime == '2') {
                        $("#guestFromTime").html("1-120分钟");
                    }

                    if (timeType == '0' && 　isOverTime != '2') {
                        $("#guestFromTime").html("1-90分钟");
                    }
                    //$("#guestFromTime").html("1-"+personPass.fromTime+"分钟");
                    if (personId == '') {
                        $("#guestPersonId").val("");
                        var homePersonId = $("#homePersonId").val();
                        var guestPersonId = $("#guestPersonId").val();
                        $("#guest_team_title").html("平均站位和传球网络  Positions and Passing Network");
                        $("#guest_person_pass").html("");
                        $("#guestPassRight").attr("style", "display:block;");
                        $("#guestPassLeft").attr("style", "display:block;");
                        $("#matchPersonGuestPass").attr("style", "display:none;");
                        if (homePersonId == '' && guestPersonId == '') {
                            $("input:radio[name='lineType']").attr("disabled", false);
                            $("input:radio[name='viewType']").attr("disabled", false);
                        }
                    } else {
                        var personPassHtml = "";
                        var matchPersonPassList = personPass.matchPersonPassList;
                        matchPersonPassList = eval(matchPersonPassList);
                        var matchPersonPass = personPass.matchPersonPass;
                        $.each(matchPersonPassList, function (i, item) {
                            personPassHtml = personPassHtml + "<p>";
                            personPassHtml = personPassHtml + item.passCount;
                            personPassHtml = personPassHtml + " " + item.fromPersonNameEn;
                            personPassHtml = personPassHtml + "—"
                            personPassHtml = personPassHtml + item.toPersonNameEn;
                            personPassHtml = personPassHtml + "</p>"
                        });
                        $("#matchPersonGuestPass").html(personPassHtml);
                        $("#guest_person_pass").html(matchPersonPass.personNameEn + matchPersonPass.succPasses + "/" + matchPersonPass.passes);
                        $("#matchPersonGuestPass").attr("style", "display:block;");
                        $("#guestPassRight").attr("style", "display:none;");
                        $("#guestPassLeft").attr("style", "display:none;");
                        var newNodec = $("[name='" + personId + "c']");
                        var newNodet = $("[name='" + personId + "t']");
                        newNodec.attr("stroke", "#0a2b77");
                        newNodec.attr("stroke-width", "2");
                        newNodet.attr("fill", "#0a2b77");
                    }
                }
            }
        );
    }

    //画传球配合线(纵向)
    function drawLineHorizontal(svgId, x1, y1, x2, y2, passCount, fromRadius, toRadius) {
        x1 = parseInt(x1);
        y1 = parseInt(y1);
        x2 = parseInt(x2);
        y2 = parseInt(y2);
        //从右侧划线到左侧
        var limitRadius = fromRadius + toRadius;
        var limitX = Math.abs(x2 - x1);
        if (limitRadius * 2 < limitX) {
            if (x2 >= x1) {
                y1 = y1 - 5;
                y2 = y2 - 5;
            } else {
                y1 = y1 + 5;
                y2 = y2 + 5;
            }
        } else {
            if (y2 >= y1) {
                x1 = x1 + 5;
                x2 = x2 + 5;
            } else {
                x1 = x1 - 5;
                x2 = x2 - 5;
            }

        }
        var linewidth;
        var colour;
        if (passCount <= 4) {
            colour = "#D9D9D9";
        } else if (passCount <= 8) {
            colour = "#808080";
        } else if (passCount <= 12) {
            colour = "#404040";
        } else if (passCount > 12) {
            colour = "#262626";
        }
        linewidth = passCount / 3 + 0.5;
        //计算两点之间的距离
        var linex = Math.abs(x1 - x2);
        var liney = Math.abs(y1 - y2);
        var linexy = (linex + liney) / 2;
        var linelength;
        if (linexy > toRadius) {
            linelength = toRadius * 0.8 / linewidth * 2;
        } else {
            linelength = linexy / linewidth * 2.5;
        }
        //不能超过直线的长度
        if (linelength >= linexy) {
            linelength = 1;
        }
        var m = getMarkerArrowHorizontal(svgId, linelength, colour);
        var svg = Snap("#" + svgId);
        var line = svg.paper.line(y1, x1, y2, x2).attr({
            stroke: colour,
            strokeWidth: linewidth,
            fill: colour,
            "marker-end": m
        });
    }

    function getMarkerArrowHorizontal(svgId, linelength, colour) {
        // 三角
        var p1 = Snap("#" + svgId).paper.path("M0,0 L0,4 L4,2 L0,0").attr({
            fill: colour
        });
        // 变身标记
        return p1.marker(0, 0, 13, 13, linelength, 2);
    }

    //画球员阵型纵向
    function drawPersonHorizontal(svgId, x, y, personId, nameEn, name, size, isSubstitution, teamType, teamId, targetPersonId) {
        x = parseInt(x);
        y = parseInt(y);
        var colour;
        var svg = Snap("#" + svgId);
        var circle = svg.paper.circle(x, y, size).attr({ "team": teamType, "sub": teamType + isSubstitution, "name": personId + "c" });
        var text = svg.paper.text(x - size, y + size + 10, name).attr({ "text-anchor": "right", "sub": teamType + isSubstitution, "team": teamType, "name": personId + "t" });
        if (teamType == "H") {//主队
            if (isSubstitution == 1) {
                circle.attr("fill", "#d70303");
                colour = "#d70303";
            } else {
                circle.attr("fill", "#ff4343");
                colour = "#ff4343";
            }
            if (targetPersonId != personId) {
                circle.mouseover(function () {
                    var newNodec = $("[name='" + personId + "c']");
                    $("[name='" + personId + "c']").remove();
                    $("#" + svgId).append(newNodec);
                    var newNodet = $("[name='" + personId + "t']");
                    $("[name='" + personId + "t']").remove();
                    $("#" + svgId).append(newNodet);
                    circle.attr("stroke", "#6f0a0a");
                    circle.attr("stroke-width", "2");
                    text.attr({ "fill": "#6f0a0a", "stroke": "#6f0a0a", "stroke-width": "2" });
                });
                circle.mouseout(function () {
                    circle.attr("stroke", colour);
                    circle.attr("stroke-width", "0");
                    text.attr("fill", "#000000");
                });
                text.mouseover(function () {
                    var newNodec = $("[name='" + personId + "c']");
                    $("[name='" + personId + "c']").remove();
                    $("#" + svgId).append(newNodec);
                    var newNodet = $("[name='" + personId + "t']");
                    $("[name='" + personId + "t']").remove();
                    $("#" + svgId).append(newNodet);
                    circle.attr("stroke", "#6f0a0a");
                    circle.attr("stroke-width", "2");
                    text.attr("fill", "#6f0a0a");
                });
                text.mouseout(function () {
                    circle.attr("stroke", colour);
                    circle.attr("stroke-width", "0");
                    text.attr("fill", "#000000");
                });
            }


        } else {//客队
            if (isSubstitution == 1) {
                circle.attr("fill", "#1d4bb5");
                colour = "#1d4bb5";
            } else {
                circle.attr("fill", "#5982e0");
                colour = "#5982e0";
            }
            if (targetPersonId != personId) {
                circle.mouseover(function () {
                    var newNodec = $("[name='" + personId + "c']");
                    $("[name='" + personId + "c']").remove();
                    $("#" + svgId).append(newNodec);
                    var newNodet = $("[name='" + personId + "t']");
                    $("[name='" + personId + "t']").remove();
                    $("#" + svgId).append(newNodet);
                    circle.attr("stroke", "#0a2b77");
                    circle.attr("stroke-width", "2");
                    text.attr({ "fill": "#6f0a0a", "stroke": "#6f0a0a", "stroke-width": "1" });
                });
                circle.mouseout(function () {
                    circle.attr("stroke", colour);
                    circle.attr("stroke-width", "0");
                    text.attr({ "fill": "#000000", "stroke-width": "0" });
                });
                text.mouseover(function () {
                    var newNodec = $("[name='" + personId + "c']");
                    $("[name='" + personId + "c']").remove();
                    $("#" + svgId).append(newNodec);
                    var newNodet = $("[name='" + personId + "t']");
                    $("[name='" + personId + "t']").remove();
                    $("#" + svgId).append(newNodet);
                    circle.attr("stroke", "#0a2b77");
                    circle.attr("stroke-width", "2");
                    text.attr({ "fill": "#6f0a0a", "stroke": "#6f0a0a", "stroke-width": "1" });
                });
                text.mouseout(function () {
                    circle.attr("stroke", colour);
                    circle.attr("stroke-width", "0");
                    text.attr({ "fill": "#000000", "stroke-width": "0" });
                });
            }

        }
        circle.click(function () {
            $("input:radio[name='lineType']").attr("disabled", true);
            $("input:radio[name='viewType']").attr("disabled", true);
            passNetworkDrawParper(teamId, svgId, teamType, personId);
            if (teamType == "H") {
                $("#home_team_title").html("传球分布" + name + " Passing Network");
                $("#home_person_pass").html(name);
                $("#homePersonId").val("1");
            } else {
                $("#guest_team_title").html("传球分布" + name + " Passing Network");
                $("#guest_person_pass").html(name);
                $("#guestPersonId").val("1");
            }

        });
    }


    //页面加载完成绘制传球->传控网张图end1111111111111
    // 传球、进攻比例、进攻方式切换
    $("#tab2").on("click", "li", function () {
        $(this).addClass("tab-selected").siblings().removeClass("tab-selected");
        var dataValue = $(this).data("value");
        $("#" + dataValue).removeClass("hide").siblings("div").addClass("hide");
    })

    // 传球-->传控网张、传球分析切换
    $("#tab21").on("click", "li", function () {
        $(this).addClass("type-selected").siblings().removeClass("type-selected");
        dataValue = $(this).data("value");
        $("#" + dataValue + "-filter").removeClass("hide").siblings(".filter-box-t").addClass("hide");
        $("#" + dataValue + "-table").removeClass("hide").siblings(".main-left-b").addClass("hide");
        $("#" + dataValue + "-main").removeClass("hide").siblings(".main-right").addClass("hide");
        if (dataValue == "pass-analyze") {
            drawContinuityPassChart("continuity_pass_chart");
        }
    })
    // 进攻比例-->进攻区域、半场控球比、三区控球比切换
    $("#tab22").on("click", "li", function () {
        $(this).addClass("type-selected").siblings().removeClass("type-selected");
        dataValue = $(this).data("value");
        $("#" + dataValue + "-filter").removeClass("hide").siblings(".filter-box-t").addClass("hide");
        $("#" + dataValue + "-main").removeClass("hide").siblings(".main-right").addClass("hide");
    })

    // 画两队连续传球图表
    function drawContinuityPassChart(id) {
        $('#' + id).highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: '两队连续传球图表'
            },
            xAxis: {
                categories: [
                    '主队',
                    '客队'
                ],
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: '传球次数'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y}次</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true,
                followPointer: true
            },
            plotOptions: {
                column: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        style: {
                            color: '#000'
                        },
                        overflow: 'none',
                        crop: false
                    }
                }
            },
            series: [{
                name: '2次连续传球',
                data: [49, 71],
                pointPadding: 0
            }, {
                name: '3次连续传球',
                data: [92, 78],
                pointPadding: 0
            }, {
                name: '4次连续传球',
                data: [48, 38],
                pointPadding: 0
            }, {
                name: '5次连续传球',
                data: [42, 33],
                pointPadding: 0
            }]
        })
    }

// 传球、进攻比例、进攻方式 模块end






    // 点击传球统计表中的数据，弹出模态框事件
    $("#passingCount").on("click", "td", function () {
        var tdStr = Number($(this).text());
        if (tdStr == 0) {

            return;
        } else {
            $("#event-playback").removeClass("hide");
        }
    })
    $("#passingCount").on("mouseover", "td", function () {
        var tdStr = Number($(this).text());
        if (tdStr == 0) {
            $(this).css({ "opacity": "0.5" })
            return;
        } else {
            $(this).css("backgroundColor", "aqua");
        }
    })
    $("#passingCount").on("mouseout", "td", function () {
        $(this).css("backgroundColor", "#f2f2f2");
    })

    // 关闭模态框事件
    $(".close-modal").on("click", function () {
        $("#event-playback").addClass("hide");
    })

// //在模态框中画球员及传球路线
    // var json3 =
    //     [
    //         {
    //             "actionName": "",
    //             "code": "90",
    //             "codeType": "1",
    //             "groupNo": "2159880990",
    //             "half": 2,
    //             "id": "93216019",
    //             "leagueId": "",
    //             "matchId": "2994",
    //             "personId": "1049",
    //             "personName": "王永珀",
    //             "personNameEn": "Wang Yongpo",
    //             "personNumber": 39,
    //             "teamId": "1030",
    //             "traceTime": "26:41",
    //             "x": 316,
    //             "y": 244
    //         },
    //         {
    //             "actionName": "",
    //             "code": "555",
    //             "codeType": "1",
    //             "groupNo": "2159880990",
    //             "half": 2,
    //             "id": "93216018",
    //             "leagueId": "",
    //             "matchId": "2994",
    //             "personId": "",
    //             "personName": "",
    //             "personNameEn": "",
    //             "personNumber": 0,
    //             "teamId": "1030",
    //             "traceTime": "26:44",
    //             "x": 215,
    //             "y": 198
    //         }
    //     ]

    // drawLineShot(json3, "trace_pass", "white");

    // function drawLineShot(jsonData, svgId, color) {
    //     var json = eval(jsonData);
    //     var m = getMarkerArrow(svgId, color);
    //     var n = getMarkerCircle(svgId, color);
    //     var x1, y1, x2, y2;
    //     var code;
    //     $.each(json, function (i, item) {
    //         if (item.code == '90' || item.code == '1' || item.code == '500' || item.code == '78' || item.code == '504') {
    //             x1 = item.x;
    //             y1 = item.y;
    //             code = item.code;
    //         }
    //         if (item.code == '555') {
    //             x2 = item.x;
    //             y2 = item.y;
    //         }
    //     });
    //     drawLineByCode(Math.round(x1 * 1), Math.round(y1 * 1), Math.round(x2 * 1), Math.round(y2 * 1), svgId, m, n, color);
    // }

    // function drawLineByCode(x1, y1, x2, y2, svgId, m, n, color) {
    //     var svg = Snap("#" + svgId);
    //     // var f = Snap.filter.shadow(0, 2, .3);  
    //     var line = svg.paper.line(x1, y1, x2, y2).attr({
    //         // fill:color,
    //         stroke: color,
    //         strokeWidth: 1.1,
    //         "marker-start": n,
    //         "marker-end": m
    //     });
    // }

    // function getMarkerArrow(svgId, color) {
    //     // 三角M2,2 L2,11 L10,6 L2,2   
    //     // console.log(Snap("#"+svgId))
    //     var p1 = Snap("#" + svgId).paper.path("M0,0 L0,6 L6,3 L0,0").attr({
    //         fill: color,
    //     });
    //     // 变身标记
    //     return p1.marker(0, 0, 13, 13, 3, 3);
    // }
    // function getMarkerCircle(svgId, color) {
    //     // 三角M2,2 L2,11 L10,6 L2,2   
    //     var p1 = Snap("#" + svgId).paper.circle(9, 9, 9).attr({
    //         fill: color,
    //     });
    //     var t1 = Snap("#" + svgId).paper.text(16, 16, "10");
    //     // Text path usage
    //     t1.attr({ textpath: "M8,8L16,16" });
    //     // or
    //     var pth = Snap("#" + svgId).paper.path("M10,10L100,100");
    //     t1.attr({ textpath: pth });
    //     // 变身标记
    //     return p1.marker(0, 0, 18, 18, 9, 9);
    //     return pth.marker(0, 0, 18, 18, 9, 9);
    // }
// //在模态框中画球员及传球路线

    //在模态框中画球员及传球路线
    $.getJSON(
        "js/passP2P.json",
        function (result) {
            $.each(result, function (i, item) {
                drawPass("trace_pass", item.personFromNum, item.personFromY, item.personFromX, item.personToNum, item.personToY, item.personToX, item.fromTeamId, item.toTeamId, item.groupNo, item.matchId);
            })
        }
    )

    var hometeamId = "1000"; // 页面动态赋值，这里试验先写死    
    function drawPass(svgId, personFromNum, personFromX, personFromY, personToNum, personToX, personToY, fromTeamId, toTeamId, groupNo, matchId) {
        personFromX = parseInt(personFromX) * 0.84;
        personFromY = parseInt(personFromY) * 0.84;
        personFromNum = parseInt(personFromNum);
        personToX = parseInt(personToX) * 0.84;
        personToY = parseInt(personToY) * 0.84;
        personToNum = parseInt(personToNum);
        var svg = Snap("#" + svgId);
        var linColor = "white";
        var circleFromColor;
        var textFromColor;
        var circleToColor;
        var textToColor;

        if (fromTeamId == hometeamId) {//主队
            circleFromColor = "#35aae5";
            textFromColor = "white";
            if (toTeamId == hometeamId) {//主队
                circleToColor = "#35aae5";
                textToColor = "white";
            } else if (toTeamId != hometeamId) {//客队
                circleToColor = "#4a5266";
                textToColor = "white";
                linColor = "red";
            }
        } else if (fromTeamId != hometeamId) {//客队
            circleFromColor = "#4a5266";
            textFromColor = "white";
            if (toTeamId == hometeamId) {//主队
                circleToColor = "#35aae5";
                textToColor = "white";
                linColor = "red";
            } else if (toTeamId != hometeamId) {//客队
                circleToColor = "#4a5266";
                textToColor = "white";
            }
        }

        //球传到界外
        if (fromTeamId == toTeamId && personFromNum == personToNum) {
            linColor = "red";
            circleTo.attr("display", "none");
            textTo.attr("display", "none");
        }

        var m = getMarkerArrow(svgId, linColor);
        var slopy = Math.atan2((personFromY - personToY), (personFromX - personToX));
        drawLineByCode(Math.round(personFromX * 1), Math.round(personFromY * 1), Math.round(personToX + 13 * Math.cos(slopy)), Math.round(personToY + 13 * Math.sin(slopy)), svgId, m, linColor);


        var circleFrom = svg.paper.circle(personFromX, personFromY, 10);
        var textFrom = svg.paper.text(personFromX, personFromY + 5, personFromNum).attr({ "text-anchor": "middle" });

        circleFrom.dblclick(function () {
            playMedia(matchId, groupNo);
        });

        textFrom.dblclick(function () {
            playMedia(matchId, groupNo);
        });

        var circleTo = svg.paper.circle(personToX, personToY, 10);
        var textTo = svg.paper.text(personToX, personToY + 5, personToNum).attr({ "text-anchor": "middle" });

        circleTo.dblclick(function () {
            playMedia(matchId, groupNo);
        });

        textTo.dblclick(function () {
            playMedia(matchId, groupNo);
        });

        circleFrom.attr({ "fill": circleFromColor, "stroke": "white" });
        textFrom.attr({ "fill": textFromColor });
        circleTo.attr({ "fill": circleToColor, "stroke": "white" });
        textTo.attr({ "fill": textToColor });


    }

    function drawLineByCode(x1, y1, x2, y2, svgId, m, color) {
        var svg = Snap("#" + svgId);
        // var f = Snap.filter.shadow(0, 2, .3);  
        var line = svg.paper.line(x1, y1, x2, y2).attr({
            // fill:color,
            stroke: color,
            strokeWidth: 1.1,
            "marker-end": m
        });
    }
    function getMarkerArrow(svgId, color) {
        // 三角M2,2 L2,11 L10,6 L2,2   
        var p1 = Snap("#" + svgId).paper.path("M0,0 L0,6 L6,3 L0,0").attr({
            fill: color,
        });
        // 变身标记
        return p1.marker(0, 0, 13, 13, 3, 3);
    }

    function getMarkerArrow1(svgId){
        // 	var marker = "<defs><marker id=\"markerArrow\" markerWidth=\"13\" markerHeight=\"13\" refx=\"2\" refy=\"6\" orient=\"auto\"><path d=\"M2,2 L2,11 L10,6 L2,2\" style=\"fill: #000000;\" /></marker></defs>"
        // 	$("#"+svgId).append(marker);
            // 三角
            var p1 = Snap("#"+svgId).paper.path("M2,2 L2,11 L10,6 L2,2").attr({
                fill: "#000"
            });
                
            // 变身标记
            return p1.marker(0, 0, 10, 10, 2, 6);
        }

    //在模态框中画球员及传球路线



    getThePlayersList();
    //ajax请求球员列表封装
    function getThePlayersList() {
        $.getJSON(
            "js/players.json",
            function (result) {

                renderTableBody(result);

                // 列表标题行点击当前列排序
                $("#players-table-match thead a").each(function (i, e) {
                    var index = i;
                    var ascend = false;  //true 为升序  false 为降序
                    $(this).on("click", function () {
                        var value = $(this).data("value");
                        //第二列名字列不可排序
                        if (index == 1) {
                            return;
                        }
                        //点击之后排序 
                        var sortStr = $(this).attr("name");
                        if (ascend == false) {
                            ascend = true;
                            result.sort(function (a, b) {
                                return a["" + sortStr] - b["" + sortStr];
                            })
                        } else {
                            ascend = false;
                            result.sort(function (a, b) {
                                return b["" + sortStr] - a["" + sortStr];
                            })
                        }
                        // 排序之后重新渲染
                        renderTableBody(result);
                        // 排序之后样式切换                    
                        $(this).addClass("active").parent().siblings().children("a").removeClass("active");
                        $("#players-table-match tbody a").each(function (j, v) {
                            var tempStr = $(this).data("value");
                            if (tempStr == value) {
                                $(this).addClass("sort").siblings().removeClass("sort");
                            }
                        })
                    })
                })

            }
        )
    }

    // 动态渲染表格封装
    function renderTableBody(result) {
        var html = "";
        for (var i = 0; i < result.length; i++) {
            html += '<tr data-value="' + (i + 1) + '">' +
                '<td><a href="javascript:;" data-value="1">' + result[i].num + '</a></td>' +
                '<td>' +
                '<a href="personal_data.html" data-value="2">' +
                '<p class="name">' + result[i].name + '</p>' +
                '<p class="position">' + result[i].position + '</p>' +
                '</a>' +
                '</td>' +
                '<td><a href="javascript:;" data-value="3">' + result[i].matchCount + '</a></td>' +
                '<td><a href="javascript:;" data-value="4">' + result[i].matchTime + '</a></td>' +
                '<td><a href="javascript:;" data-value="5">' + result[i].goal + '</a></td>' +
                '<td><a href="javascript:;" data-value="6">' + result[i].xG + '</a></td>' +
                '<td><a href="javascript:;" data-value="7">' + result[i].assist + '</a></td>' +
                '<td><a href="javascript:;" data-value="8">' + result[i].keyPass + '</a></td>' +
                '<td><a href="javascript:;" data-value="9">' + result[i].pass + '</a></td>' +
                '<td><a href="javascript:;" data-value="10">' + result[i].passSuccessRate * 100 + '%' + '</a></td>' +
                '<td><a href="javascript:;" data-value="11">' + result[i].averageScore + '</a></td>' +
                '<td><a href="javascript:;" data-value="12">' + result[i].nearestFiveTimeAvScore + '</a></td>' +
                '<td><a href="javascript:;" data-value="13">' + result[i].nearestFiveTimeAvScore + '</a></td>' +
                '<td><a href="javascript:;" data-value="14">' + result[i].pass + '</a></td>' +
                '</tr>'
        }
        $("#players-table-match tbody").html(html);
    }







    //颜色MAP
    var colorMap = new Map();
    //进攻
    colorMap.put("8","#f70909");
    colorMap.put("9","#f49233");
    colorMap.put("49","#ebd51c");
    colorMap.put("78","#40c312");
    colorMap.put("90","#5bb0eb");
    colorMap.put("500","#3057e8");
    colorMap.put("86","#b40ab6");
    colorMap.put("172","#b40ab6");
    colorMap.put("504","#42da98");
    colorMap.put("410","#FF1493");
    colorMap.put("411","#DDA0DD");
    //定位球
    colorMap.put("2","#f70909");
    colorMap.put("10","#f49233");
    colorMap.put("14","#ebd51c");
    colorMap.put("17","#40c312");
    colorMap.put("19","#5bb0eb");
    
    //防守
    // 抢断 start
    colorMap.put("26","#f70909");
    colorMap.put("350","#f70909");
    // 抢断  end
    // 门将出击 start
    colorMap.put("352","#ff33ff");
    colorMap.put("353","#ff33ff");
    // 门将出击 end
    colorMap.put("27","#f49233");
    colorMap.put("28","#ebd51c");
    colorMap.put("32","#40c312");
    colorMap.put("502","#42da98");
    colorMap.put("204","#b40ab6");
    colorMap.put("205","#42da98");
    
    //犯规
    colorMap.put("21","#40c312");
    colorMap.put("61","#40c312");
    colorMap.put("400","#40c312");
    colorMap.put("22","#f49233");
    colorMap.put("24","#ebd51c");
    colorMap.put("25","#f70909");
    colorMap.put("117","#ebd51c");
    colorMap.put("62","#42da98");
    //对抗
    colorMap.put("356","#FF0000");
    colorMap.put("357","#40c312");
    //球权转换
    colorMap.put("503","#FFE4B5");
    colorMap.put("413","#FFC0CB");
    colorMap.put("412","#FF1493");
    colorMap.put("66","#CD5C5C");
    

})