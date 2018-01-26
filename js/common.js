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
        {name:"广州恒大淘宝",url:"http://csfile.oss-cn-hangzhou.aliyuncs.com/teamlogo/hengda_s.png?Expires=4600489802&OSSAccessKeyId=ZMQayXeY7ZLaB0BH&Signature=i%2BDTRxN52TXNdswfXDZsmNudsAU%3D"},
        {name:"上海上港",url:"http://csfile.oss-cn-hangzhou.aliyuncs.com/teamlogo/dongya_s.png?Expires=4600490291&OSSAccessKeyId=ZMQayXeY7ZLaB0BH&Signature=lRspDf1kmJJzAq2BQyy0mbiL0Rg%3D"},
        {name:"天津权健",url:"http://csfile.oss-cn-hangzhou.aliyuncs.com/teamlogo/50/2017_1_1030.png?Expires=4642910148&OSSAccessKeyId=xQ9FkjDA2vJOhB9D&Signature=tN7CX0pKB5hz99Grhs3mjQLWY1I%3D"},
        {name:"河北华夏幸福",url:"http://csfile.oss-cn-hangzhou.aliyuncs.com/teamlogo/50/2017_1_1031.png?Expires=4669257376&OSSAccessKeyId=xQ9FkjDA2vJOhB9D&Signature=8BYMPNiLMz3heOt%2B%2FQ9RX2NYesk%3D"},
        {name:"广州富力",url:"http://csfile.oss-cn-hangzhou.aliyuncs.com/teamlogo/fuli_s.png?Expires=4600490290&OSSAccessKeyId=ZMQayXeY7ZLaB0BH&Signature=HAXKoVApmS3fz4ZrPmtND1Lhh5g%3D"},
        {name:"山东鲁能泰山",url:"http://csfile.oss-cn-hangzhou.aliyuncs.com/teamlogo/luneng_s.png?Expires=4600490289&OSSAccessKeyId=ZMQayXeY7ZLaB0BH&Signature=M8HG%2Feq7hYgDaOortkhw95KSnMo%3D"},
        {name:"长春亚泰",url:"http://csfile.oss-cn-hangzhou.aliyuncs.com/teamlogo/yatai_s.png?Expires=4600490292&OSSAccessKeyId=ZMQayXeY7ZLaB0BH&Signature=FqK17LVI0F3CXbbHAmjcNJ7PRKA%3D"},
        {name:"贵州恒丰智诚",url:"http://csfile.oss-cn-hangzhou.aliyuncs.com/teamlogo/50/2017_1_1041.png?Expires=4642910460&OSSAccessKeyId=xQ9FkjDA2vJOhB9D&Signature=Blvy3Ik1hLTS7NbNSDg2fRjD%2BFY%3D"},
        {name:"北京中赫国安",url:"http://csfile.oss-cn-hangzhou.aliyuncs.com/teamlogo/guoan_s.png?Expires=4600490289&OSSAccessKeyId=ZMQayXeY7ZLaB0BH&Signature=eL5N4uTUQOyuGh6YAbViWPrmHjA%3D"},
        {name:"重庆当代力帆",url:"http://csfile.oss-cn-hangzhou.aliyuncs.com/teamlogo/lifan_s.png?Expires=4600490292&OSSAccessKeyId=ZMQayXeY7ZLaB0BH&Signature=FN2NWVjluREEETiR4UtdJRH2e3s%3D"},
        {name:"上海绿地申花",url:"http://csfile.oss-cn-hangzhou.aliyuncs.com/teamlogo/shenhua_s.png?Expires=4600490291&OSSAccessKeyId=ZMQayXeY7ZLaB0BH&Signature=GPjhHzIAEgTPQJqcA3%2BJX7i3OdY%3D"},
        {name:"江苏苏宁易购",url:"http://csfile.oss-cn-hangzhou.aliyuncs.com/teamlogo/50x57.png?Expires=4613177565&OSSAccessKeyId=ZMQayXeY7ZLaB0BH&Signature=Uz%2BAbuzm0uLd0luGn1YoEAOwuS8%3D"},
        {name:"天津泰达亿利",url:"http://csfile.oss-cn-hangzhou.aliyuncs.com/teamlogo/taida_s.png?Expires=4600490291&OSSAccessKeyId=ZMQayXeY7ZLaB0BH&Signature=QW6f3wZatDBCPMSRI%2FCTsWV%2F%2B%2BU%3D"},
        {name:"河南建业",url:"http://csfile.oss-cn-hangzhou.aliyuncs.com/teamlogo/jianye_s.png?Expires=4600490292&OSSAccessKeyId=ZMQayXeY7ZLaB0BH&Signature=1v%2BjOKMaeEr8PseCKKhr7%2FBFYi8%3D"},
        {name:"延边富德",url:"http://csfile.oss-cn-hangzhou.aliyuncs.com/teamlogo/yanbianchangbaishan_s.png?Expires=4600490298&OSSAccessKeyId=ZMQayXeY7ZLaB0BH&Signature=n7MZXXESHocqUkG%2BxyaVMZ3z%2B%2BQ%3D"},
        {name:"辽宁沈阳开新",url:"http://csfile.oss-cn-hangzhou.aliyuncs.com/teamlogo/hongyuan_s.png?Expires=4600490291&OSSAccessKeyId=ZMQayXeY7ZLaB0BH&Signature=mA17jKqo2KO5RVOAAY5l%2FI4oi%2B4%3D"}
    ]; 
    
    for(var i = 0; i < allianceTeams.length; i++){
        html+= '<li class="f-l team-logo">'+
        '<img src="'+allianceTeams[i].url+'" alt="">'+
        '<p>'+allianceTeams[i].name+'</p>'+
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