/**
 * Created by admin on 2017/4/19.
 */
$(function(){
    var form = $("form");
    var name = $("input[name='name']");
    var password = $("input[name='password']");
    var code = $("input[name='code']");
    var codeImg = $(".img");
    form.submit(submitHandler);
    function submitHandler(){
        return check();
        function check(){
            if(!$.trim(name.val())){
                alert("请输入用户名");
                return false;
            }
            if(!$.trim(password.val())){
                alert("请输入密码");
                return false;
            }
            if(!$.trim(code.val())){
                alert("请输入验证码");
                return false;
            }
        }
    }
    //页面加载时获取验证码
    getCodeImg();
    function getCodeImg(){
        $.ajax({
            type:"get",
            url:"/codeImg",
            success:function(data){
                codeImg.html("<img src='/codeImg'/>");
            }
        });
    }
    //----------------------------------------------------------

    //登陆时异步获取验证码

    //----------------------------------------------------------
    codeImg.on("click",function(){
        getCodeImg();
    });

});