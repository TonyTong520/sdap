$(function(){

    // document.oncontextmenu=function(){return false;}; 
    document.onselectstart=function(){return false;};

    // 动态添加球队选择滚动条
    var html="";
    var scrollWidth = 0;
    var allianceTeams = 30;  //联赛球队数--动态获取
    
    for(var i = 0; i < allianceTeams; i++){
        html+= '<li class="f-l team-logo">'+
        '<img src="images/gzhd.png" alt="">'+
        '<p>广州恒大淘宝'+i+'</p>'+
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
        
           
        if(leftNum > -(allianceTeams-8)*step ){       
            num-=8;
        }else{
            leftNum = -(allianceTeams-8)*step;
        }
        leftNum = step*num;  
        if(leftNum <= (8-allianceTeams)*step){
            leftNum = (8-allianceTeams)*step;
        }
        $("#scroller").css("left", leftNum+"px");
    })
   

    ////滚动条双击选择一个球队事件
    $("#scroller ul").on("click","li",function(){
        $(this).addClass("select").siblings().removeClass("select");
    })




})