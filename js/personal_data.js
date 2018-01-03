$(function () {

    getThePlayersList();
    //ajax请求球员列表封装
    function getThePlayersList() {
        $.getJSON(
            "js/players_league.json",
            function (result) {
                renderTableBody(result);

                // 列表标题行点击当前列排序
                $(".personal-data-table thead a").each(function (i, e) {
                    var index = i;
                    var ascend = false;  //true 为升序  false 为降序
                    $(this).on("click", function () {
                        var value = $(this).data("value");
                        //第一列赛事列不可排序
                        if (index == 0) {
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
                        $(".personal-data-table tbody a").each(function (j, v) {
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
        var matchCountSum = 0,matchTimeSum = 0,xGSum = 0,assistSum = 0,keyPassSum = 0,passSum = 0,passSuccessRateSum = 0,averageScoreSum = 0,nearestFiveTimeAvScoreSum =0;
        for (var i = 0; i < result.length; i++) {
            html += '<tr data-value="' + (i + 1) + '">' +
                '<td><a href="javascript:;" data-value="1">' + result[i].league + '</a></td>' +
                '<td><a href="javascript:;" data-value="3">' + result[i].matchCount + '</a></td>' +
                '<td><a href="javascript:;" data-value="4">' + result[i].matchTime + '</a></td>' +
                // '<td><a href="javascript:;" data-value="5">' + result[i].goal + '</a></td>' +
                '<td><a href="javascript:;" data-value="6">' + result[i].xG + '</a></td>' +
                '<td><a href="javascript:;" data-value="7">' + result[i].assist + '</a></td>' +
                '<td><a href="javascript:;" data-value="8">' + result[i].keyPass + '</a></td>' +
                '<td><a href="javascript:;" data-value="9">' + result[i].pass + '</a></td>' +
                '<td><a href="javascript:;" data-value="10">' + result[i].passSuccessRate * 100 + '%' + '</a></td>' +
                '<td><a href="javascript:;" data-value="11">' + result[i].averageScore + '</a></td>' +
                '<td><a href="javascript:;" data-value="12">' + result[i].nearestFiveTimeAvScore + '</a></td>' +
                '</tr>';
            matchCountSum += result[i].matchCount;
            matchTimeSum += result[i].matchTime;
            xGSum += result[i].xG;
            assistSum += result[i].assist;
            keyPassSum += result[i].keyPass;
            passSum += result[i].pass;
            passSuccessRateSum += result[i].passSuccessRate;
            averageScoreSum += result[i].averageScore;
            nearestFiveTimeAvScoreSum += result[i].nearestFiveTimeAvScore;
        }
        $(".personal-data-table tbody").html(html);

        // 统计：求总和或平均值
        var tfootStr = '<tr data-value="sum">'+
                            '<td><a href="javascript:;" data-value="1">总计/平均</a></td>'+
                            '<td><a href="javascript:;" data-value="2">'+ matchCountSum +'</a></td>'+
                            '<td><a href="javascript:;" data-value="3">'+ (matchTimeSum / result.length).toFixed(2) +'</a></td>'+
                            '<td><a href="javascript:;" data-value="4">'+ xGSum +'</a></td>'+
                            '<td><a href="javascript:;" data-value="5">'+ assistSum +'</a></td>'+
                            '<td><a href="javascript:;" data-value="6">'+ keyPassSum +'</a></td>'+
                            '<td><a href="javascript:;" data-value="7">'+ passSum +'</a></td>'+
                            '<td><a href="javascript:;" data-value="8">'+ (passSuccessRateSum / result.length*100).toFixed(2) + '%' + '</a></td>'+
                            '<td><a href="javascript:;" data-value="9">'+ (averageScoreSum / result.length).toFixed(2) +'</a></td>'+
                            '<td><a href="javascript:;" data-value="10">'+ (nearestFiveTimeAvScoreSum / result.length).toFixed(2) +'</a></td>'+
                        '</tr>';
        $(".personal-data-table tfoot").html(tfootStr);
    }




//根据球员位置信息动态渲染九宫格
    if ($("#player-position").text() != "守门员") {
        console.log($("#player-position").text())
    } else {
        var html = '<li class="select" data-name="champdas-socring">' +
            '<p class="item-name">创冰评分</p>' +
            '<p class="item-data">93.34</p>' +
            '</li>' +
            '<li data-name="save-success-rate">' +
            '<p class="item-name">扑救成功率</p>' +
            '<p class="item-data">59</p>' +
            '</li>' +
            '<li data-name="goal-kick-droppoint">' +
            '<p class="item-name">球门球距离落点</p>' +
            '<p class="item-data">100</p>' +
            '</li>' +
            '<li data-name="passing-success-rate-gk">' +
            '<p class="item-name">传球成功率</p>' +
            '<p class="item-data">20</p>' +
            '</li>' +
            '<li data-name="tackl-cross">' +
            '<p class="item-name">拦截传中</p>' +
            '<p class="item-data">20%</p>' +
            '</li>' +
            '<li data-name="save-penalty">' +
            '<p class="item-name">扑出点球</p>' +
            '<p class="item-data">93</p>' +
            '</li>' +
            '<li></li><li></li><li></li>';
        $("#filter-selecter").html(html);
    }
//根据球员位置信息动态渲染九宫格

//比赛条件筛选 
    // 赛事筛选
    $("#match-filter").on("click", "a", function () {

        if ($(this).hasClass("all")) {
            $("#match-filter a").removeClass("active");
            $(this).addClass("active");
        } else {
            $("#match-filter a.all").removeClass("active");
            $(this).toggleClass("active");
        }

        if (!$("#match-filter a").hasClass("active")) {
            $(this).addClass("active");
        }

    })
    // 主客场筛选
    $("#home-and-away-filter").on("click", "a", function () {

        if ($(this).hasClass("all")) {
            $("#home-and-away-filter a").removeClass("active");
            $(this).addClass("active");
        } else {
            $("#home-and-away-filter a.all").removeClass("active");
            $("#home-and-away-filter a").removeClass("active");
            $(this).addClass("active");
        }
    })


    // 数据类型切换
    $(".tab-bar ul").on("click", "li", function () {
        $(this).addClass("tab-selected").siblings().removeClass("tab-selected");
    })
//比赛条件筛选 

// 轮次滑动条滑动
    // 轮次滑动条选择工具
    var _move = false;                 
    var _x1;                            
    var _x2;
    var x1;
    var x2;    
    var gameNum = 15;    //比赛场次
    var step = 778 / gameNum;  

    // 滑块滑动                   
    $(".slider-handler-left").mousedown(function (e) {
        $(".slider-handler-left").addClass("focus").siblings().removeClass("focus");
        var _this = $(".slider-handler-left");
        if (!_move) {
            _move = true;
            _x1 = e.pageX - parseFloat(_this.css("left"));

        } else {
            _move = false;
        }
        $(document).mousemove(function (e) {
            var _this = $(".slider-handler-left");
            var sliderRightX =  parseFloat($(".slider-handler-right").css("left"));
            if (_move) {
                x1 = e.pageX - _x1;
                if(x1 < -7){
                    x1 = -7;
                }else if( x1 > sliderRightX + 7 - step){
                    x1 =  sliderRightX + 7 - step;
                }
                var steps = Math.round(x1 / step);
                if(steps < 0){
                    steps = 0;
                }
                $(".slider-handler-left").text(steps);
                _this.css({ left: steps * step - 7});
                $(".slider-range").css({left:steps * step});
            }
        }).mouseup(function () {
            var _this = $(".slider-handler-left");
            _move = false;
            $(document).unbind("mousemove");     
        });
    });
    
    $(".slider-handler-right").mousedown(function (e) {
        $(".slider-handler-right").addClass("focus").siblings().removeClass("focus");;
        var _this = $(".slider-handler-right");
        if (!_move) {
            _move = true;
            _x2 = e.pageX - parseFloat(_this.css("left"));

        } else {
            _move = false;
        }
        $(document).mousemove(function (e) {
            var _this = $(".slider-handler-right");
            var sliderLeftX = parseFloat($(".slider-handler-left").css("left"));
            if (_move) {
                x2 = 778 - (e.pageX - _x2);
                if(x2 < -7){
                    x2 = -7;
                }else if( x2 >778 - 7 - sliderLeftX -step){
                    x2 = 778 - 7 - sliderLeftX -step;
                }
                var steps = Math.round(x2 / step);
                if(steps < 0){
                    steps = 0;
                }
                _this.css({ right: steps * step - 7 });
                $(".slider-range").css({right:steps * step})
            }
        }).mouseup(function () {
            var _this = $(".slider-handler-right");
            _move = false;
            $(document).unbind("mousemove");    
        });
    });
// 轮次滑动条滑动end


    drawChampdasScoreChart("champdas-socring-chart");

    // 九宫格点击切换右侧图表区域
    $("#filter-selecter").on("click", "li", function () {
        if ($(this).hasClass("select") || $(this).data("name") == null) {
            return;
        }
        $(this).addClass("select").siblings().removeClass("select");
        var nameStr = $(this).data("name");

        switch (nameStr) {
            case "champdas-socring": // 球员创冰评分
                var html = '<div id="champdas-socring-chart" data-name="champdas-socring" class="chart champdas-socring"></div>';
                $(".res-r").html(html);
                drawChampdasScoreChart("champdas-socring-chart");
                break;
            case "goals":// 球员进球
                var html = '<div id="goals-chart" data-name="goals" class="chart goals clearfix">' +
                    '<div id="goals-chart-l" class="chart-left f-l"></div>' +
                    '<div class="chart-right f-l">' +
                    '<div class="chart-r-t">' +
                    '<ul class="data-list">' +
                    '<li class="clearfix">' +
                    '<span class="item f-l">进球</span>' +
                    '<span class="value f-r">29</span>' +
                    '</li>' +
                    '<li class="clearfix">' +
                    '<span class="item f-l">期待进球</span>' +
                    '<span class="value f-r">22</span>' +
                    '</li>' +
                    '<li class="clearfix">' +
                    '<span class="item f-l">射门</span>' +
                    '<span class="value f-r">302</span>' +
                    '</li>' +
                    '<li class="clearfix">' +
                    '<span class="item f-l">射门转化率</span>' +
                    '<span class="value f-r">29%</span>' +
                    '</li>' +
                    '</ul>' +
                    '</div>' +
                    '<div class="chart-r-b"></div>' +
                    '</div>' +
                    '</div>';
                $(".res-r").html(html);
                drawGoalsChart("goals-chart-l");
                break;
            case "goals-accuracy":// 球员射门准确率

                var html = '<div id="goals-accuracy-rate" data-name="goals-accuracy" class="chart goals-accuracy">' +
                    '<ul class="data-list clearfix">' +
                    '<li>' +
                    '<p class="item-name">射正</p>' +
                    '<p class="item-value">56</p>' +
                    '</li>' +
                    '<li>' +
                    '<p class="item-name">射偏</p>' +
                    '<p class="item-value">43</p>' +
                    '</li>' +
                    '<li>' +
                    '<p class="item-name">射门被封堵</p>' +
                    '<p class="item-value">23</p>' +
                    '</li>' +
                    '<li>' +
                    '<p class="item-name">射门准确率</p>' +
                    '<p class="item-value">59%</p>' +
                    '</li>' +
                    '</ul>' +
                    '<div class="goals-area clearfix">' +
                    '<div class="out-left-top">59%</div>' +
                    '<div class="out-center-top">59%</div>' +
                    '<div class="out-right-top">60%</div>' +
                    '<div class="out-left-bottom">60%</div>' +
                    '<div class="out-right-bottom">60%</div>' +
                    '<div class="goal-inner">' +
                    '<div class="in-left-top">59%</div>' +
                    '<div class="in-center-top">59%</div>' +
                    '<div class="in-right-top">59%</div>' +
                    '<div class="in-left-bottom">59%</div>' +
                    '<div class="in-center-bottom">59%</div>' +
                    '<div class="in-right-bottom">59%</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                $(".res-r").html(html);
                break;
            case "pass-direction":// 向前传球占比
                var html = '<div id="pass-direction-chart" data-name="pass-direction" class="chart pass-direction"></div>';
                $(".res-r").html(html);
                drawChampdasScoreChart("pass-direction-chart");
                break;
            case "win-compete":// 赢得对抗
                var html = '<div id="win-compete-chart" data-name="win-compete" class="chart win-compete">' +
                    '<div class="item-wrapper">' +
                    '<div class="item-title clearfix">' +
                    '<p class="success f-l">成功</p>' +
                    '<p class="item-name">抢断</p>' +
                    '<p class="success f-r">失败</p>' +
                    '</div>' +
                    '<div class="item-bar clearfix">' +
                    '<p class="success-rate f-l">39%</p>' +
                    '<div class="bar">' +
                    '<div class="success-bar"></div>' +
                    '</div>' +
                    '<p class="failure-rate f-r">61%</p>' +
                    '</div>' +
                    '</div>' +
                    '<div class="item-wrapper">' +
                    '<div class="item-title clearfix">' +
                    '<p class="item-name">犯规</p>' +
                    '</div>' +
                    '<div class="item-bar clearfix">' +
                    '<p class="success-rate f-l">39%</p>' +
                    '<div class="bar">' +
                    '<div class="success-bar"></div>' +
                    '</div>' +
                    '<p class="failure-rate f-r">61%</p>' +
                    '</div>' +
                    '</div>' +
                    '<div class="item-wrapper">' +
                    '<div class="item-title clearfix">' +
                    '<p class="item-name">过人</p>' +
                    '</div>' +
                    '<div class="item-bar clearfix">' +
                    '<p class="success-rate f-l">39%</p>' +
                    '<div class="bar">' +
                    '<div class="success-bar"></div>' +
                    '</div>' +
                    '<p class="failure-rate f-r">61%</p>' +
                    '</div>' +
                    '</div>' +
                    '<div class="item-wrapper">' +
                    '<div class="item-title clearfix">' +
                    '<p class="item-name">空中对抗</p>' +
                    '</div>' +
                    '<div class="item-bar clearfix">' +
                    '<p class="success-rate f-l">39%</p>' +
                    '<div class="bar">' +
                    '<div class="success-bar"></div>' +
                    '</div>' +
                    '<p class="failure-rate f-r">61%</p>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                $(".res-r").html(html);
                break;
            case "win-balls":// 赢得球权
                var html = '<div id="win-balls-chart" data-name="win-balls" class="chart win-balls">' +
                    '<ul class="data-list clearfix">' +
                    '<li>' +
                    '<p class="item-name">赢得球权总数</p>' +
                    '<p class="item-value">56</p>' +
                    '</li>' +
                    '<li>' +
                    '<p class="item-name">每90分钟赢得球权数</p>' +
                    '<p class="item-value">43</p>' +
                    '</li>' +
                    '<li></li>' +
                    '</ul>' +
                    '<div class="data-areas">' +
                    '<ul class="areas clearfix">' +
                    '<li>10%</li><li>10%</li><li>10%</li><li>10%</li>' +
                    '<li>10%</li><li>10%</li><li>10%</li><li>10%</li>' +
                    '<li>10%</li><li>10%</li><li>10%</li><li>10%</li>' +
                    '<li>10%</li><li>10%</li><li>10%</li><li>10%</li>' +
                    '<li>10%</li><li>10%</li><li>10%</li><li>10%</li>' +
                    '<li>10%</li><li>10%</li><li>10%</li><li>10%</li>' +
                    '</ul>' +
                    '</div>' +
                    '</div>';
                $(".res-r").html(html);
                break;
            case "passing-front-accuracy": // 向前传球占比
                var html = '<p class="pass_f">向前</p>' +
                    '<p class="pass_l">向左</p>' +
                    '<p class="pass_r">向右</p>' +
                    '<p class="pass_b">向后</p>' +
                    '<div id="passing-front-accuracy-chart" data-name="passing-front-accuracy" class="chart passing-front-accuracy"></div>';
                $(".res-r").html(html);
                drawPassingFrontAccuracyChart("passing-front-accuracy-chart");
                break;
            case "passing-success-rate": // 传球成功率
                var html = '<div id="passing-success-rate-chart" data-name="passing-success-rate" class="chart passing-success-rate"></div>';
                $(".res-r").html(html);
                drawPassingSuccessRate("passing-success-rate-chart");
                break;
            case "create-opportunities": // 创造机会
                var html = '<div id="create-opportunities-chart" data-name="create-opportunities" class="chart create-opportunities">' +
                    '<ul class="data-list clearfix">' +
                    '<li>' +
                    '<p class="item-name">助攻</p>' +
                    '<p class="item-value">56</p>' +
                    '</li>' +
                    '<li>' +
                    '<p class="item-name">关键传球</p>' +
                    '<p class="item-value">43</p>' +
                    '</li>' +
                    '<li>' +
                    '<p class="item-name">期待助攻（xA)</p>' +
                    '<p class="item-value">40.22</p>' +
                    '</li>' +
                    '<li></li>' +
                    '</ul>' +
                    '<div class="football-court clearfix">' +
                    '<div class="bg">' +
                    '<div class="svg-wrapper">' +
                    '<svg id="trace_pass" xmlns="http://www.w3.org/2000/svg" version="1.1" width="366px" height="244px"></svg>' +
                    '</div>'
                '</div>' +
                    '</div>' +
                    '</div>';
                $(".res-r").html(html);
                // drawPassingSuccessRate("create-opportunities-chart");
                var json1 =
                    [
                        {
                            "actionName": "",
                            "code": "90",
                            "codeType": "1",
                            "groupNo": "2159880990",
                            "half": 2,
                            "id": "93216019",
                            "leagueId": "",
                            "matchId": "2994",
                            "personId": "1049",
                            "personName": "王永珀",
                            "personNameEn": "Wang Yongpo",
                            "personNumber": 39,
                            "teamId": "1030",
                            "traceTime": "26:41",
                            "x": 200,
                            "y": 200
                        },
                        {
                            "actionName": "",
                            "code": "555",
                            "codeType": "1",
                            "groupNo": "2159880990",
                            "half": 2,
                            "id": "93216018",
                            "leagueId": "",
                            "matchId": "2994",
                            "personId": "",
                            "personName": "",
                            "personNameEn": "",
                            "personNumber": 0,
                            "teamId": "1030",
                            "traceTime": "26:44",
                            "x": 183,
                            "y": 122
                        }
                    ]
                var json2 =
                    [
                        {
                            "actionName": "",
                            "code": "90",
                            "codeType": "1",
                            "groupNo": "2159880990",
                            "half": 2,
                            "id": "93216019",
                            "leagueId": "",
                            "matchId": "2994",
                            "personId": "1049",
                            "personName": "王永珀",
                            "personNameEn": "Wang Yongpo",
                            "personNumber": 39,
                            "teamId": "1030",
                            "traceTime": "26:41",
                            "x": 0,
                            "y": 0
                        },
                        {
                            "actionName": "",
                            "code": "555",
                            "codeType": "1",
                            "groupNo": "2159880990",
                            "half": 2,
                            "id": "93216018",
                            "leagueId": "",
                            "matchId": "2994",
                            "personId": "",
                            "personName": "",
                            "personNameEn": "",
                            "personNumber": 0,
                            "teamId": "1030",
                            "traceTime": "26:44",
                            "x": 125,
                            "y": 150
                        }
                    ]
                var json3 =
                    [
                        {
                            "actionName": "",
                            "code": "90",
                            "codeType": "1",
                            "groupNo": "2159880990",
                            "half": 2,
                            "id": "93216019",
                            "leagueId": "",
                            "matchId": "2994",
                            "personId": "1049",
                            "personName": "王永珀",
                            "personNameEn": "Wang Yongpo",
                            "personNumber": 39,
                            "teamId": "1030",
                            "traceTime": "26:41",
                            "x": 366,
                            "y": 244
                        },
                        {
                            "actionName": "",
                            "code": "555",
                            "codeType": "1",
                            "groupNo": "2159880990",
                            "half": 2,
                            "id": "93216018",
                            "leagueId": "",
                            "matchId": "2994",
                            "personId": "",
                            "personName": "",
                            "personNameEn": "",
                            "personNumber": 0,
                            "teamId": "1030",
                            "traceTime": "26:44",
                            "x": 215,
                            "y": 198
                        }
                    ]

                drawLineShot(json1, "trace_pass", "blue");
                drawLineShot(json2, "trace_pass", "#c6000e");
                drawLineShot(json3, "trace_pass", "#c6000e");
                var path = $('#trace_pass line');
                for (var i = 0; i < path.length; i++) {
                    var length = path[i].getTotalLength();
                    // 清除之前的动作
                    path[i].style.transition = path[i].style.WebkitTransition =
                        'none';
                    // 设置起始点
                    path[i].style.strokeDasharray = length + ' ' + length;
                    path[i].style.strokeDashoffset = length;
                    // 获取一个区域，获取相关的样式，让浏览器寻找一个起始点。
                    path[i].getBoundingClientRect();
                    // 定义动作
                    path[i].style.transition = path[i].style.WebkitTransition =
                        'stroke-dashoffset 1s ease-in-out';
                    // Go!
                    path[i].style.strokeDashoffset = '0';
                }
                break;
            case "single-game-fouls":// 球员单场犯规次数
                var html = '<div id="single-game-fouls-chart" data-name="single-game-fouls" class="chart single-game-fouls">' +
                    '<ul class="data-list clearfix">' +
                    '<li>' +
                    '<p class="item-name">犯规</p>' +
                    '<p class="item-value">56</p>' +
                    '</li>' +
                    '<li>' +
                    '<p class="item-name">黄牌</p>' +
                    '<p class="item-value">43</p>' +
                    '</li>' +
                    '<li>' +
                    '<p class="item-name">红牌</p>' +
                    '<p class="item-value">22</p>' +
                    '</li>' +
                    '<li>' +
                    '<p class="item-name">两黄变一红</p>' +
                    '<p class="item-value">33</p>' +
                    '</li>' +
                    '</ul>' +
                    '<div class="football-court clearfix">' +
                    '<div class="bg">' +
                    '<div class="wrapper">' +
                    '<div class="foul"></div>' +
                    '<div class="yellow-card"></div>' +
                    '<div class="red-card"></div>' +
                    '<div class="yellow-to-red"></div>' +
                    '</div>'
                '</div>' +
                    '</div>' +
                    '</div>';
                $(".res-r").html(html);
                break;
            case "save-success-rate": // 守门员扑球成功率
                var html = '<div id="save-success-rate-chart" data-name="save-success-rate" class="chart save-success-rate"></div>';
                $(".res-r").html(html);
                saveSucessRateChart("save-success-rate-chart");
                break;
            case "goal-kick-droppoint":// 守门员球门球距离落点
                var html = '<div id="goal-kick-droppoint-chart" data-name="goal-kick-droppoint" class="chart goal-kick-droppoint">' +
                    '<ul class="data-list clearfix">' +
                    '<li>' +
                    '<p class="item-name">平均球门球距离</p>' +
                    '<p class="item-value">56m</p>' +
                    '</li>' +
                    '<li></li><li></li><li></li>' +
                    '</ul>' +
                    '<div class="football-court clearfix">' +
                    '<div class="bg">' +
                    '<div class="wrapper">' +
                    '<div class="droppoint"></div>' +
                    '<div class="droppoint1"></div>' +
                    '</div>'
                '</div>' +
                    '</div>' +
                    '</div>';
                $(".res-r").html(html);
                break;
            case "passing-success-rate-gk": // 守门员传球成功率
                var html = '<div id="passing-success-rate-gk-chart" data-name="passing-success-rate-gk" class="chart passing-success-rate-gk"></div>';
                $(".res-r").html(html);
                passingSuccessRateGk("passing-success-rate-gk-chart");
                break;
            case "tackl-cross":// 守门员拦截传中
                var html = '<div id="tackl-cross-chart" data-name="tackl-cross" class="chart tackl-cross">' +
                    '<ul class="data-list clearfix">' +
                    '<li>' +
                    '<p class="item-name">面对传中次数</p>' +
                    '<p class="item-value">56</p>' +
                    '</li>' +
                    '<li>' +
                    '<p class="item-name">击出传中次数</p>' +
                    '<p class="item-value">43</p>' +
                    '</li>' +
                    '<li>' +
                    '<p class="item-name">抱住传中次数</p>' +
                    '<p class="item-value">22</p>' +
                    '</li>' +
                    '</ul>' +
                    '<div class="wrapper">' +
                    '<div class="hide-football-court">' +
                    '<div class="tackl-point"></div>' +
                    '<div class="tackl-point1"></div>' +
                    '<div class="tackl-point2"></div>' +
                    '<div class="tackl-point3"></div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                $(".res-r").html(html);
                break;
            case "save-penalty":// 守门员扑出点球
                var html = '<div id="save-penalty-chart" data-name="save-penalty" class="chart save-penalty">' +
                    '<ul class="data-list clearfix">' +
                    '<li>' +
                    '<p class="item-name">面对点球次数</p>' +
                    '<p class="item-value">56</p>' +
                    '</li>' +
                    '<li>' +
                    '<p class="item-name">对手射偏次数</p>' +
                    '<p class="item-value">43</p>' +
                    '</li>' +
                    '<li>' +
                    '<p class="item-name">扑出点球次数</p>' +
                    '<p class="item-value">22</p>' +
                    '</li>' +
                    '</ul>' +
                    '<div class="wrapper">' +
                    '<div class="hide-goal-mouth">' +
                    '<div class="save-goal-point"></div>' +
                    '<div class="save-goal-point1"></div>' +
                    '<div class="save-goal-point2"></div>' +
                    '<div class="save-goal-point3"></div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                $(".res-r").html(html);
                break;


        }

    })



    // 绘制创冰评分图表封装
    function drawChampdasScoreChart(id) {
        $('#' + id).highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: '创冰评分'
            },
            xAxis: {
                categories: ['2017.10.18中超', '2017.10.23中超', '2017.10.23中超', '2017.10.23中超', '2017.10.23中超', '2017.10.23中超', '2017.10.23中超'],
                labels: {
                    autoRotation: [-10, -20, -30, -40, -50, -60, -70, -80, -90]
                }
            },
            yAxis: {
                title: {
                    text: '评分'
                }
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
            },
            series: [{
                name: '联赛评分',
                data: [75, 50, 80, 82, 86, 90, 70]
            }, {
                name: '联赛同位置其他球员评分',
                data: [70, 72, 78, 80, 73, 76, 75]
            } ],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        });    
    }

    // 绘制进球图表封装
    function drawGoalsChart(id) {
        $('#' + id).highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: '各分区进球比'
            },
            xAxis: {
                categories: ['1区', '2区', '3区', '4区', '5区', '6区', '点球']
            },
            yAxis: {
                min: 0,
                title: {
                    text: '进球数'
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                shared: true
            },
            plotOptions: {
                column: {
                    grouping: false,
                    shadow: false,
                    borderWidth: 0
                }
            },
            series: [{
                name: '射门次数',
                color: 'rgba(165,170,217,1)',
                data: [150, 73, 20,150, 73, 20,30],
                pointPadding: 0.3,
                pointPlacement: 0,
                pointWidth: 20
            }, {
                name: '进球数',
                data: [
                    {color:"#6e523f","y":140},
                    {color:"#987059","y":78},
                    {color:"#a88d68","y":40},
                    {color:"#208dbd","y":126},
                    {color:"#299fc4","y":90},
                    {color:"#53afb0","y":68},
                    {color:"#2a7ce1","y":59},
                ],
                pointPadding: 0.4,
                pointPlacement: 0,
                pointWidth: 12
            }]
        });
    }

    // 绘制向前传球占比雷达图
    function drawPassingFrontAccuracyChart(id) {
        $('#' + id).highcharts({
            chart: {
                polar: true,
            },
            title: {
                text: null
            },
            exporting: {
                enabled: true
            },
            credits: {
                enabled: false
            },
            tooltip: {
                enabled: false,
            },
            pane: {
                startAngle: 0,
                endAngle: 360
            },
            xAxis: {
                tickInterval: 90,
                min: 0,
                max: 360,
                labels: {
                    formatter: function () {
                        return this.value + '°';
                    }
                }
            },
            yAxis: {
                max: 12,// 加这个试试
                tickInterval: 4,    //设置Y轴坐标值的间隔固定为100
            },
            plotOptions: {
                series: {
                    pointStart: -22.5,
                    pointInterval: 45
                },
                column: {
                    pointPadding: 0,
                    groupPadding: 0
                }
            },
            legend: {
                enabled: false,
            },
            series: [{
                type: 'column',
                name: 'Column',
                data: [10.2, 4.6, 3.0, 2, 3, 5, 1.0, 5.8],
                pointPlacement: 'between'
            }]
        });
    }

    // 绘制传球准确率图
    function drawPassingSuccessRate(id) {

        $('#' + id).highcharts({
            chart: {
                type: 'areaspline',
                zoomType: 'x'
            },
            title: {
                text: '传球准确率'
            },
            legend: {
                layout: 'horizontal',
                align: 'left',
                verticalAlign: 'top',
                x: 35,
                y: 20
            },
            xAxis: {
                categories: ['2017.10.18中超',
                    '2017.10.23中超',
                    '2017.10.24中超',
                    '2017.10.25中超',
                    '2017.10.26中超',
                    '2017.10.27中超',
                    '2017.10.23中超'
                ],
                labels: {
                    autoRotation: [-10, -20, -30, -40, -50, -60, -70, -80, -90]
                },
                tickmarkPlacement: 'on'            
            },
            yAxis: {
                title: {
                    text: '传球 个数'
                }
            },
            tooltip: {
                shared: true,
                valueSuffix: ' 个',
                formatter: function () {
                    var s = '<b>' + this.x + '</b>';
                    $.each(this.points, function () {
                        s += '<br/>' + this.series.name + ': ' +
                            this.y + '个';
                    });
                    s += '<br/>' + '传球成功率:' + Math.round((this.points[1].y / this.points[0].y).toFixed(4) * 10000) / 100 + '%';
                    s += '<br/>' + '传球到禁区成功率:' + Math.round((this.points[3].y / this.points[2].y).toFixed(4) * 10000) / 100 + '%';
                    return s;
                },
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                areaspline: {
                    fillOpacity: 0.5
                }
            },
            series: [{
                name: '传球总数',
                data: [10, 15, 13, 16, 19, 12, 15]
            }, {
                name: '传球成功数',
                data: [5, 7, 6, 9, 4, 5, 8]
            }, {
                name: '传球到禁区数',
                data: [8, 12, 13, 11, 14, 5, 9]
            }, {
                name: '传球到禁区成功数',
                data: [2, 3, 5, 3, 6, 2, 4]
            }]
        });
    }

// 创造机会图表画线
    function drawLineShot(jsonData, svgId, color) {
        var json = eval(jsonData);
        var m = getMarkerArrow(svgId, color);
        var n = getMarkerCircle(svgId, color);
        var x1, y1, x2, y2;
        var code;
        $.each(json, function (i, item) {
            if (item.code == '90' || item.code == '1' || item.code == '500' || item.code == '78' || item.code == '504') {
                x1 = item.x;
                y1 = item.y;
                code = item.code;
            }
            if (item.code == '555') {
                x2 = item.x;
                y2 = item.y;
            }
        });
        drawLineByCode(Math.round(x1 * 1), Math.round(y1 * 1), Math.round(x2 * 1), Math.round(y2 * 1), svgId, m, n, color);
    }

    function drawLineByCode(x1, y1, x2, y2, svgId, m, n, color) {
        var svg = Snap("#" + svgId);
        // var f = Snap.filter.shadow(0, 2, .3);  
        var line = svg.paper.line(x1, y1, x2, y2).attr({
            // fill:color,
            stroke: color,
            strokeWidth: 1.1,
            "marker-start": n,
            "marker-end": m
        });
    }

    function getMarkerArrow(svgId, color) {
        // 三角M2,2 L2,11 L10,6 L2,2   
        console.log(Snap("#" + svgId))
        var p1 = Snap("#" + svgId).paper.path("M0,0 L0,6 L6,3 L0,0").attr({
            fill: color,
        });
        // 变身标记
        return p1.marker(0, 0, 13, 13, 3, 3);
    }
    function getMarkerCircle(svgId, color) {
        // 三角M2,2 L2,11 L10,6 L2,2   
        var p1 = Snap("#" + svgId).paper.circle(2.5, 2.5, 2.5).attr({
            fill: color,
        });
        // 变身标记
        return p1.marker(0, 0, 5, 5, 2.5, 2.5);
    }
// 创造机会图表画线

    // 守门员选项===========
    // 扑救成功率
    function saveSucessRateChart(id) {
        $('#' + id).highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: '扑球成功率'
            },
            tooltip: {
                headerFormat: '{series.name}<br>',
                pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: '扑球或失球占比',
                data: [
                    {
                        name: '失球',
                        y: 12,
                        sliced: true,
                        selected: true,
                        color: '#4b5266'
                    },
                    {
                        name: '扑球次数',
                        y: 50,
                        color: '#35aae6'
                    }
                ]
            }]
        });
    }

    // 守门员传球成功率
    function passingSuccessRateGk(id) {
        $('#' + id).highcharts({
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: '传球成功率'
            },

            xAxis: [{
                categories: ['中超第1轮', '中超第1轮', '中超第1轮', '中超第1轮', '中超第1轮', '中超第1轮', '中超第1轮', '中超第1轮', '中超第1轮', '中超第1轮', '中超第1轮', '中超第1轮'],
                // crosshair: true,
                labels: {
                    autoRotation: [-10, -20, -30, -40, -50, -60, -70, -80, -90]
                }
            }],
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '{value} 个',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                title: {
                    text: '传球数量',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                }
            }, { // Secondary yAxis
                title: {
                    text: '成功率',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                labels: {
                    format: '{value} %',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                opposite: true
            }],
            tooltip: {
                shared: true
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'top',
                y: 20,
                floating: true,
                backgroundColor: 'none'
            },
            plotOptions: {
                column: {
                    grouping: false,
                    shadow: false,
                    borderWidth: 0
                }
            },
            series: [{
                name: '成功率',
                type: 'column',
                yAxis: 1,
                data: [49.9, 71.5, 16.4, 29.2, 44.0, 76.0, 35.6, 48.5, 26.4, 94.1, 95.6, 54.4],
                pointPadding: 0.2,
                pointPlacement: 0,
                tooltip: {
                    valueSuffix: '%'
                }
            }, {
                name: '传球数量',
                type: 'column',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
                pointPadding: 0.4,
                pointPlacement: 0,
                tooltip: {
                    valueSuffix: '个'
                }
            }]
        });
    }


    // 点击球员列表单个球员，切换到该球员页面=====================================
    $(".players-list").on("click", "li", function () {
        window.location.href = "personal_data.html";
    })

})