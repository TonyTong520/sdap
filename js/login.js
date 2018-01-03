$(function(){

    //表单输入获取焦点
    $(".user-info input").focus(function(){
        $(this).css({"color":"#35aae6"}).parent().css({"borderColor":"#35aae6","color":"#35aae6"});
        
    })
    //表单输入判断
    $(".user-info input").on("input",function(){
        if($(this).parent().hasClass("account")){
            if($(this).val() == "" || $(this).val().length < 4 || $(this).val().length > 20 ){
                $(".error-tips").show().text("*账号必须在4到20个字符之间").css("color","red");
            }else{
                $(".error-tips").hide();
            }
        }
        if($(this).parent().hasClass("password")){
            if( $(this).val().length < 6 ){
                $(".error-tips").show().text("*密码长度不能少于6个字符").css("color","red");
            }else{
                $(".error-tips").hide();
            }
        }
    })

    //表单输入失去焦点
    $(".user-info input").blur(function(){
        $(this).css({"color":"#000"}).parent().css({"borderColor":"#c9c9c9","color":"#c9c9c9"});
    })

    //提交按钮
    $(".submit").on("click",function(){
        $(this).css("backgroundColor","#35aae6");
    })

})