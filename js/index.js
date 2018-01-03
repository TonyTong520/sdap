$(function(){


    // 首页/视频分析/数据报告页面切换
    $(".nav-bar").on("click","a",function(){
        $(this).addClass("select").parent().siblings().children("a").removeClass("select");
        var nameStr = $(this).attr("name");
        $("."+nameStr+"-main").removeClass("hide").siblings(".main").addClass("hide");
    })

    //联赛类型切换
    $(".league-tab ul").on("click","li",function(){
        $(this).addClass("tab-selected").siblings().removeClass("tab-selected");
    })


     //表现分析表格悬停事件
     var timer = null;
     $(".hover-area").on("mouseenter",function(){
 
 
         var that = $(this);
         timer = setTimeout(function(){
             that.children("span").removeClass("hide");
             var categoryName = that.attr("name");
             console.log(categoryName)
             $(".hover-tips").removeClass("hide").children(".category-name").text(categoryName);
             if(that.hasClass("right")){
                 $(".hover-tips").css("left","44px");
             }else{
                 $(".hover-tips").css("left","0");
             }
         },500);
     })
 
     $(".hover-area").on("mouseleave",function(){
         clearTimeout(timer);
         $(this).children("span").addClass("hide");
         $(".hover-tips").addClass("hide");
     })
 
//传球数据表格
    $('#chart-of-passball').highcharts({  
        chart: {
            type: 'solidgauge',
            marginLeft: 80
        },
        title: {
            text: null
        },
        pane: {
            startAngle: 0,
            endAngle: 360,
            background: [{ 
                outerRadius: '72',
                innerRadius: '70',
                backgroundColor: '#4b5266',
                borderWidth: 0
            }, { 
                outerRadius: '56',
                innerRadius: '54',
                backgroundColor: "#9a9a9e",
                borderWidth: 0
            }, { 
                outerRadius: '38',
                innerRadius: '36',
                backgroundColor: "#cdcdcd",
                borderWidth: 0
            }]
        },
        tooltip: {
            enabled: true,
            useHTML: true,
            followPointer: true,
            formatter: function(){
                return '<table style="width:200px;">'+
                    '<thead>'+
                    '<tr>'+
                    '<th style="text-align:center;color:#35aae6">'+this.series.name+'数据</th>'+
                    '<th style="text-align:center;">本队</th>'+
                    '<th style="text-align:center;">联赛平均</th>'+
                    '</tr>'+
                    '</thead>'+
                    '<tbody>'+
                    '<tr>'+
                    '<td style="text-align:center;">数据</td>'+
                    '<td style="text-align:center;">1</td>'+
                    '<td style="text-align:center;">1</td>'+
                    '</tr>'+
                    '<tr>'+
                    '<td style="text-align:center;">占总数</td>'+
                    '<td style="text-align:center;">'+ this.y +'%</td>'+
                    '<td style="text-align:center;">1</td>'+
                    '</tr>'+
                    '<tr>'+
                    '<td style="text-align:center;">准确率</td>'+
                    '<td style="text-align:center;">1</td>'+
                    '<td style="text-align:center;">1</td>'+
                    '</tr>'+
                    '</tbody>'+
                    '</table>'
            },
            backgroundColor: '#fff',
            borderColor: '#ccc',
            borderWidth: 1,
            padding: 0
            // textStyle: {
            //     color: '#000',
            //     // fontStyle: 'normal',
            //     // fontFamily: 'sans-serif',
            //     fontSize: 12,
            //     lineHeight: 12,
            // }
        },
        yAxis: {
            min: 0,
            max: 100,
            lineWidth: 0,
            tickPositions: []
        },
        plotOptions: {
            solidgauge: {
                borderWidth: '4px',
                dataLabels: {
                    enabled: false
                },
                linecap: '',
                stickyTracking: false
            }
        },
        series: [{
            name: '长传',
            borderColor:'#008cd6',
            data: [{
                color: "#008cd6",
                radius: '108',
                innerRadius: '100',
                y: 50
            }]
        }, {
            name: '中传',
            borderColor: '#35aae6',
            data: [{
                color: '#35aae6',
                radius: '84',
                innerRadius: '76',
                y: 30
            }]
        }, {
            name: '短传',
            borderColor:'#80d4ff',
            data: [{
                color: '#80d4ff',
                radius: '58',
                innerRadius: '50',
                y: 20
            }]
        }]
    });
//传球数据表格

//比赛条件筛选start==============================
    // 赛季筛选
    $("#season-filter").on("click","a",function(){
        
        if($(this).hasClass("all")){
            $("#season-filter a").removeClass("active");
            $(this).addClass("active");
        }else{
            $("#season-filter a.all").removeClass("active");
            $(this).toggleClass("active");
        }

        if( !$("#season-filter a").hasClass("active")){
            $(this).addClass("active");
        }

    })
    // 赛事筛选
    $("#match-filter").on("click","a",function(){

        if($(this).hasClass("all")){
            $("#match-filter a").removeClass("active");
            $(this).addClass("active");
        }else{
            $("#match-filter a.all").removeClass("active");
            $(this).toggleClass("active");  
        }

        if( !$("#match-filter a").hasClass("active")){
            $(this).addClass("active");
        }
            
    })
    // 主客场筛选
    $("#home-and-away-filter").on("click","a",function(){

        if($(this).hasClass("all")){
            $("#home-and-away-filter a").removeClass("active");
            $(this).addClass("active");
        }else{
            $("#home-and-away-filter a.all").removeClass("active");
            $("#home-and-away-filter a").removeClass("active");
            $(this).addClass("active");  
        }
    })
    // 战绩筛选
    $("#record-filter").on("click","a",function(){

        if($(this).hasClass("all")){
            $("#record-filter a").removeClass("active");
            $(this).addClass("active");
        }else{
            $("#record-filter a.all").removeClass("active");
            $(this).toggleClass("active");  
        }

        if( !$("#record-filter a").hasClass("active")){
            $(this).addClass("active");
        } 
    
    })
//比赛条件筛选end=================================


//比赛条件筛选结果分页start==============================
    var dataLength = 111;
    var pageTotal = Math.ceil( dataLength / 5 );
    var flag = null;
    //动态渲染视频分页页数
    function getVideoPagination(){
       
        var html = "";
        flag = 1;       
        for(var i = 0; i < pageTotal; i++){
            if(i==0){
                html+='<li class="page-item f-l" value="1" style="display: none;"  name="first-page">1</li>';
                html+='<li class="page-item-dots f-l" value="..." style="display: none;" disabled name="prev-dots">...</li>';
                html+='<li class="page-item f-l select" value="'+(i+1)+'">'+(i+1)+'</li>';
            }else{
                html+='<li class="page-item f-l" value="'+(i+1)+'">'+(i+1)+'</li>';
            }           
            if(pageTotal >7){
                if(i==4){
                    html+='<li class="page-item-dots f-l" value="..." disabled name="next-dots">...</li>';
                    html+='<li class="page-item f-l" value="'+pageTotal+'" name="last-page">'+pageTotal+'</li>';
                    $(".pagination-bar").html(html);
                 
                }else if(i>5){
                    return;
                }
            }          
        }      
        $(".pagination-bar").html(html);       
    }
   
    getVideoPagination();

    
    //视频下五个分页
    $(".next-page").click(function(){
        $(".pagination-bar li").removeClass("select");     
        $(".prev-page").attr("disabled",false);
        for(var i = 2; i < 7; i++){
            var temp = $(".pagination-bar li").eq(i).val();
            temp=temp+5;
            $(".pagination-bar li").eq(i).text(temp).val(temp);           
            if(temp >= pageTotal){
                $(".pagination-bar li").eq(i).hide();           
                $(".next-page").attr("disabled",true);
            }              
        }       
        if(pageTotal - $(".pagination-bar li").eq(6).val() <= 1){
            $(this).attr("disabled",true);
        }else{
            $(this).attr("disabled",false);
        }     
        if($(".pagination-bar li").eq(2).val() > 1){
            $(".pagination-bar li[name='first-page']").show();
            $(".pagination-bar li[name='prev-dots']").show();
        }
        for(var k = 0; k < 9; k++){
            if($(".pagination-bar li").eq(k).val() == flag){
                $(".pagination-bar li").eq(k).addClass("select");
            }
        }             
    })

    //视频上五个分页
    $(".prev-page").click(function(){
        $(".pagination-bar li").removeClass("select");
        if($(".pagination-bar li").eq(2).val() == 1){
            $(".prev-page").attr("disabled",true);
        }else{
            $(".next-page").attr("disabled",false);
            for(var j = 2; j < 7; j++){
                var temp = $(".pagination-bar li").eq(j).val();
                temp=temp-5;
                $(".pagination-bar li").eq(j).text(temp).val(temp).show();                            
                if(temp <= 1){
                    $(".pagination-bar li").eq(0).hide();           
                    $(".pagination-bar li").eq(1).hide();           
                    $(".prev-page").attr("disabled",true);
                }                
            }
        }
        for(var k = 0; k < 9; k++){
            if($(".pagination-bar li").eq(k).val() == flag){
                $(".pagination-bar li").eq(k).addClass("select");
            }
        }
    })

    //视频点击具体分页按钮
    $(".pagination-bar").on("click",".page-item",function(){
        $(this).addClass("select").siblings().removeClass("select");
        flag = $(this).val();
    })
//比赛条件筛选结果分页end==============================


//比赛条件筛选结果列表项事件start==============================
    //点击所有进球，进入视频分析页面
    $(".all-goals").click(function(){
        $(".nav-bar a[name='video']").addClass("select").parent().siblings().children("a").removeClass("select");
        $(".video-main").removeClass("hide").siblings(".main").addClass("hide");
    })

    //点击比赛详情，进入比赛分析match.html页面
    $(".result-item .details").click(function(){
        window.location.href = "match.html";
    })

//比赛条件筛选结果列表项事件end==============================

// 球员评分模块 start======================================================================
    // 点击球员评分 详细按钮
    $("#players-detial").on("click",function(){
        $(".player-modal-wrapper").removeClass("hide");
        getThePlayersList();
    })

    // 点击单个球员，进入球员页面
    $(".players-list").on("click","li",function(){
        window.location.href = "personal_data.html";
    })

    //ajax请求球员列表封装
    function getThePlayersList(){
        $.getJSON(
            "js/players.json",
            function(result){
                
                renderTableBody(result);

                // 列表标题行点击当前列排序
                $("#players-table-index thead a").each(function(i,e){
                    var index = i;
                    var ascend = false;  //true 为升序  false 为降序
                    $(this).on("click",function(){
                        var value = $(this).data("value");
                        //第二列名字列不可排序
                        if(index == 1){
                            return;
                        }
                        //点击之后排序 
                        var sortStr = $(this).attr("name");
                        if(ascend == false){
                            ascend = true;
                            result.sort(function(a,b){
                                return a[""+ sortStr] - b[""+ sortStr];
                            })             
                        }else{
                            ascend = false;
                            result.sort(function(a,b){
                                return b[""+ sortStr] - a[""+ sortStr];
                            })         
                        }
                        // 排序之后重新渲染
                        renderTableBody(result);
                        // 排序之后样式切换                    
                        $(this).addClass("active").parent().siblings().children("a").removeClass("active");
                        $("#players-table-index tbody a").each(function(j,v){
                            var tempStr = $(this).data("value");
                            if(tempStr == value){
                                $(this).addClass("sort").siblings().removeClass("sort");
                            }
                        })
                    })     
                })
        
            }
        )
    }


    // 动态渲染表格封装
    function renderTableBody(result){
        var html = "";
        for(var i = 0; i < result.length; i++){
            html += '<tr data-value="'+ (i+1) +'">'+
                '<td><a href="javascript:;" data-value="1">'+ result[i].num +'</a></td>'+
                '<td>'+
                    '<a href="personal_data.html" data-value="2">'+
                        '<p class="name">'+ result[i].name +'</p>'+
                        '<p class="position">'+ result[i].position +'</p>'+
                    '</a>'+
                '</td>'+
                '<td><a href="javascript:;" data-value="3">'+ result[i].matchCount +'</a></td>'+
                '<td><a href="javascript:;" data-value="4">'+ result[i].matchTime +'</a></td>'+
                '<td><a href="javascript:;" data-value="5">'+ result[i].goal +'</a></td>'+
                '<td><a href="javascript:;" data-value="6">'+ result[i].xG +'</a></td>'+
                '<td><a href="javascript:;" data-value="7">'+ result[i].assist +'</a></td>'+
                '<td><a href="javascript:;" data-value="8">'+ result[i].keyPass +'</a></td>'+
                '<td><a href="javascript:;" data-value="9">'+ result[i].pass +'</a></td>'+
                '<td><a href="javascript:;" data-value="10">'+ result[i].passSuccessRate*100 +'%' +'</a></td>'+
                '<td><a href="javascript:;" data-value="11">'+ result[i].averageScore +'</a></td>'+
                '<td><a href="javascript:;" data-value="12">'+ result[i].nearestFiveTimeAvScore +'</a></td>'+
            '</tr>'
        }
        $("#players-table-index tbody").html(html);
    }

    // 点击关闭球员列表弹出框
    $(".close-modal").on("click",function(){
        $(this).parent().parent().addClass("hide");
    })
// 球员评分模块 end======================================================================


})