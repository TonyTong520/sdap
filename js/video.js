$(function(){


    
    // 比赛、事件、球员分析切换
    $(".video-tab ul li").click(function(){
        $(this).addClass("tab-selected").siblings().removeClass("tab-selected");
        var name = $(this).attr("name");
        $(".video-info-body").addClass("hide");
        $("."+name).removeClass("hide");
    })

    // 比赛分析->比赛-> 筛选
    var filterBtnTimer;
    $(".filter-btn").on("mouseenter ",function(){
        filterBtnTimer = setTimeout(function(){
            $(".filter-btn-selectbox").removeClass("hide");
        },500)
    })
    $(".filter-btn").on("mouseleave",function(){
        clearTimeout(filterBtnTimer);
        $(".filter-btn-selectbox").addClass("hide");
    })
    $(".filter-btn-selectbox").on("click","li",function(){
        $(this).addClass("select").siblings().removeClass("select").parent().addClass("hide");
    })

    // 比赛分析->比赛-> 搜索悬浮+点击
    $(".filter-search>img").on("mouseenter",function(){
        $(this).attr("src","images/search1.png");
    })
    $(".filter-search>img").on("mouseleave",function(){
        $(this).attr("src","images/search2.png");
    })
    $(".filter-search>img").on("click",function(){
        $(".search-box").children("input").css("width","150px").focus();
    })
    $(".cancel-search").on("mouseenter",function(){
        $(this).attr("src","images/cancel2.png");
    })
    $(".cancel-search").on("mouseleave",function(){
        $(this).attr("src","images/cancel1.png");
    })
    $(".cancel-search").on("click",function(){
        $(".search-box").children("input").css("width","0").val("");
    })


    // 比赛分析->比赛-> pdf、详情悬停和点击事件
    $(".download-pdf > img").on("mouseenter",function(){
        $(this).attr("src","images/video-pdf1.png");
    })
    $(".download-pdf > img").on("mouseleave",function(){
        $(this).attr("src","images/video-pdf.png");
    })
    $(".detail > img").on("mouseenter",function(){
        $(this).attr("src","images/video-detail1.png");
    })
    $(".detail > img").on("mouseleave",function(){
        $(this).attr("src","images/video-detail.png");
    })

    // 事件分析->足球场白板逻辑=======================
    // ----选区切换
    $(".area-filter-box .area-start").on("click","li",function(){

        if(!$(this).parent().parent().hasClass("disabled") && $(this)[0].className != ""){
            $(this).addClass("select").siblings().removeClass("select");
        }

    });

    // 比赛分析->球队比赛数据切换逻辑=======================
    $(".data-type-tab ul").on("click","li",function(){
        $(this).addClass("type-selected").siblings().removeClass("type-selected");
    })

    // 视频段全选按钮
    $(".select-all").on("click",function(){
        $(this).parent().siblings().children(".time-list").children(".checkbox").prop("checked","checked");
    })


    // 球员弹出模态框==================================================================start
    // 赛季条件Filter 
    $(".filter").on("click","a",function(){
        $(this).addClass("active").parent().siblings().children("a").removeClass("active");
    })







    
})