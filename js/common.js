$(function(){

    // document.oncontextmenu=function(){return false;}; 
    document.onselectstart=function(){return false;};

    var leagueId = $("#leagueId").val();
    $.ajax({
        url : "http://192.168.2.6:8888/dataapi/teamReport/teamList                                               .html?ak=123456&leagueId="+leagueId,
        type: "GET",
        dataType: "json",
        success:function(da){
            var json = eval(da);
            console.log(1111111111)
        }
    });

    // 动态添加球队选择滚动条
    var html="";
    var scrollWidth = 0;
    var allianceTeams = 30;  //联赛球队数--动态获取
    var allianceTeams = [
        "广州恒大淘宝",
        "上海上港",
        "天津权健",
        "河北华夏幸福",
        "广州富力",
        "山东鲁能泰山",
        "长春亚泰",
        "贵州恒丰智诚",
        "北京中赫国安",
        "重庆当代",
        "上海绿地申花",
        "江苏苏宁",
        "天津泰达亿利",
        "河南建业",
        "延边富德",
        "辽宁沈阳开新",
        "延边富德",
        "辽宁沈阳开新",
    ]; 
    
    for(var i = 0; i < allianceTeams.length; i++){
        html+= '<li class="f-l team-logo">'+
        '<img src="images/gzhd.png" alt="">'+
        '<p>'+allianceTeams[i]+'</p>'+
        '</li>';
        scrollWidth+=111;
    }
    $(".scroll-box ul").css({"width":scrollWidth+"px","list-style":"none"}).html(html);

    //滚动条点击上一个球队事件
    var num = 0;
    var step = 111;
    var leftNum;
    $(".prev-team").click(function(){
              
        if(leftNum < 0){
            num+=8;         
        }else{
            leftNum = 0;
        }
        leftNum = step*num;
        if(leftNum > 0){
            leftNum = 0;
        }
        $("#scroller").css("left", leftNum+"px");
    })

     //滚动条点击下一个球队事件
    $(".next-team").click(function(){
        
           
        if(leftNum > -(allianceTeams.length-8)*step ){       
            num-=8;
        }else{
            leftNum = -(allianceTeams.length-8)*step;
        }
        leftNum = step*num;  
        if(leftNum <= (8-allianceTeams.length)*step){
            leftNum = (8-allianceTeams.length)*step;
        }
        $("#scroller").css("left", leftNum+"px");
    })
   

    ////滚动条双击选择一个球队事件
    $("#scroller ul").on("click","li",function(){
        $(this).addClass("select").siblings().removeClass("select");
    })




})