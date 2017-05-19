/**
 * Created by admin on 2017/4/19.
 */
$(window).ready(function () {
    var logout = $("#logout");
    var nav = $(".list a");
    var container = $(".container");
    var forms = $(".forms");
    var tables = $(".table");
    var tableBox = $(".table_box");
    var formData = $(".formData");
    var pageData = $(".pageData");
    var howMany = $(".howMany");
    var pgUp = $(".pgUp");
    var pgDn = $(".pgDn");
    var pgEnd = $(".pgEnd");
    var pgFirst = $(".pgFirst");
    var goTo = $("#goTo");
    var pageIndex = $("#page");
    var select = $(".select");
    var search = $("#keyword");
    var pages;
    var tr;


    //翻页
    nav.each(function (i) {
        $(this).on("click",function () {
            nav.each(function(){
                $(this).css("background","");
            });
            container.each(function(){
                $(this).css("display","none");
            });
            $(this).css("background","#fff");
            container.eq(i).css("display","block");
        })
    });
    //左侧列表点击从数据库获取数据
    formData.on('click',function(){
        search.val("");
        select.val("全部");
        clear();
        tables.html("正在加载.....");
        $.ajax({
            url:"http://127.0.0.1:3000/userData",
            type:"post",
            success:function(data){
                tables.html("");
                insertData(data);
                tr = $(".pages tbody tr");
                pages = $(".pages");
                jumpPage();
                getForm();
            }
        })

    });
    pageData.on('click',function(){
        $.ajax({
            url:"http://127.0.0.1:3000/pageData",
            type:"post",
            success:function(data){
                console.log(data);
            }
        })
    });


    //选择有无申请表功能
    select.on("change",function(){
        search.val("");
        clear();
        var arr = [];
        for(var i=0;i<tr.length;i++){
            if($(this).val()=="有申请表"){
                if(tr.eq(i).text().indexOf('预览')!=-1){
                    arr.push(tr[i]);
                }
            }
            else if($(this).val()=="无申请表"){
                if(tr.eq(i).text().indexOf('预览')==-1){
                    arr.push(tr[i]);
                }
            }
            else{
                arr.push(tr[i]);
            }
        }
        selectData(arr);
        pages = $(".pages");
        var length = pages.length;
        howMany.html(length);
        jumpPage();
        getForm();
    });

    //搜索功能
    search.on('input',function(){
        select.val("全部");
        clear();
        var keyword = $(this).val();
        var arr = [];
        for(var i=0;i<tr.length;i++) {
            if(tr.eq(i).text().indexOf(keyword)!=-1){
                arr.push(tr[i]);
            }
        }
        selectData(arr);
        pages = $(".pages");
        var length = pages.length;
        howMany.html(length);
        jumpPage();
        getForm();
    });

    //搜索的方法
    function selectData(data){
        for(var i=0;i<data.length;i++){
            if(i%10==0){
                var tBody = createTable();
            }
            tBody.append(data[i]);
        }
    }
    //清除绑定事件
    function clear(){
        pageIndex.val("1");
        tables.empty();
        pgUp.off('click');
        pgDn.off('click');
        pgFirst.off('click');
        pgEnd.off('click');
        goTo.off('click');
    }

    //把得到的数据插入页面
    function insertData(data){
        for(var i=0;i<data.length;i++){
            if(i%10==0){
                var tBody = createTable();
            }
            var tr = $("<tr></tr>");
            for(var j in data[i]){
                if(data[i].hasOwnProperty(j)&&j!='password'){
                    var td = $("<td></td>");
                    if(data[i][j] == 'yes'){
                        td.html("<a class='preview'>预览</a>");
                    }
                    else{
                        td.html(data[i][j]);
                    }
                    tr.append(td);
                }
            }
            tBody.append(tr);
        }
        var length = $(".pages").length;
        howMany.html(length);
    }
    //创建表格框架
    function createTable(){
        var pages = $("<div class='pages'></div>");
        var table = $("<table></table>");
        var tHead = $("<thead></thead>");
        var tBody = $("<tbody></tbody>");
        var thTr = $("<tr></tr>");
        thTr.append($("<th class='th1'>编号</th>"));
        thTr.append($("<th class='th2'>用户名</th>"));
        thTr.append($("<th class='th3'>电子邮箱</th>"));
        thTr.append($("<th class='th4'>申请表</th>"));
        tHead.append(thTr);
        table.append(tHead);
        table.append(tBody);
        pages.append(table);
        tables.append(pages);
        return tBody;
    }

    //点击翻页
    function jumpPage(){
        pgUp.on('click',upHandler);
        function upHandler(){
            var index = nowPage();
            var p_Index = pageIndex.val()-0;
            if(index!=0){
                pages.each(function(i){
                    pages.eq(i).hide();
                });
                pages.eq(index-1).show();
                pageIndex.val(p_Index-1);
            }
        }
        pgDn.on('click',dnHandler);
        function dnHandler(){
            var index = nowPage();
            var p_Index = pageIndex.val()-0;
            if(index!=pages.length-1){
                pages.each(function(i){
                    pages.eq(i).hide();
                });
                pages.eq(index+1).show();
                pageIndex.val(p_Index+1);

            }
        }
        pgFirst.click(function(){
            var index = nowPage();
            if(index!=0){
                pages.each(function(i){
                    pages.eq(i).hide();
                });
                pages.eq(0).show();
                pageIndex.val(1);

            }
        });
        pgEnd.click(function(){
            var index = nowPage();
            if(index!=pages.length-1){
                pages.each(function(i){
                    pages.eq(i).hide();
                });
                pages.eq(pages.length-1).show();
                pageIndex.val(pages.length);

            }
        });
        goTo.click(function(){
            var index = nowPage();
            var goToIndex = pageIndex.val()-0;
            if(index!=goToIndex-1 && goToIndex>0 && goToIndex<pages.length+1){
                pages.each(function(i){
                    pages.eq(i).hide();
                });
                pages.eq(goToIndex-1).show();
                pageIndex.val(goToIndex);
            }
            else{
                pageIndex.val(index+1);
            }
        });
    }

    //返回当前block的页面
    function nowPage(){
        var pages = $(".pages");
        var index;
        pages.each(function(i){
            if(pages.eq(i).css("display")=='block'){
                index =  i;
            }
        });
        return index;
    }
    //预览点击显示申请表
    function getForm(){
        var formA = $(".user .table a");
        formA.each(function(){
            $(this).click(function(){
                var username = $(this).parent().prev().prev().html();
                $.ajax({
                    url:"http://127.0.0.1:3000/formData",
                    type:"post",
                    data:username,
                    success:function(data){
                        insertFormData(data[0]);
                    }
                })
            })
        });
    }

    //插入申请表数据
    function insertFormData(data){
        $("#firstName").html(data.firstname);
        $("#middleName").html(data.middlename);
        $("#lastName").html(data.lastname);
        $("#nickName").html(data.nickname);
        $("#birthDate").html(data.birthday);
        $("#birthMonth").html(data.birthmonth);
        $("#birthYear").html(data.birthyear);
        $("#gender").html(data.gender);
        $("#email").html(data.email);
        $("#address").html(data.address);
        $("#city").html(data.city);
        $("#state").html(data.state);
        $("#country").html(data.country);
        $("#code").html(data.postalcode);
        $("#mobilePhone").html(data.mobilephone);
        $("#homePhone1").html(data.homephone1);
        $("#homePhone2").html(data.homephone2);
        $("#major").html(data.major);
        $("#programChoice").html(data.programChoice);
        $("#schoolChoice").html(data.schoolChoice);
        if(data.degree!='Other Degree'){
            $("#degree").html(data.degree);
        }
        else{
            $("#degree").html(data.otherDegree);
        }
        forms.show();
    }



    //点击透明层申请表消失
    forms.click(function(){
        $(this).hide();
    });
    tableBox.click(function(event){
        if(event.stopPropagation){
            event.stopPropagation();
        }
        else{
            event.cancelBubble = true;
        }
    });


    var tds = $(".table_box td");
    tds.each(function(i){
        if(!$.trim(tds.eq(i).html())){
            tds.eq(i).css("color","#999");
        }
    });

    //退出前的确认
    logout.click(function(){
        if(confirm("确定退出吗？")){
            window.location.replace("/logout");
        }
    })

});