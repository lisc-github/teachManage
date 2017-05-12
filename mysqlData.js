/**
 * Created by admin on 2017/5/9.
 */
var mysql = require('mysql');
var crypto = require('crypto');
var obj = {};
function md5(text){
    return crypto.createHash('md5').update(text).digest('hex');
}
var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'lsc666666',
    database:'liscdb'
});
connection.connect();
var sql = "SELECT * FROM admininfo";
obj.queryData = function(data,req,res){
    connection.query(sql,function(err,result){
        if(err){
            return;
        }
        console.log(data.code,req.session.code);
        if(data.name != result[0].name){
            req.session.info = "用户名错误";
            res.redirect('/');
        }
        else if(md5(data.password) != result[0].password){
            req.session.info = "密码错误";
            res.redirect('/');
        }
        else if(data.code.toUpperCase() != req.session.code){
            req.session.info = "验证码错误";
            res.redirect('/');
        }
        else{
            req.session.user = data.name;
            res.redirect('user');
        }
    })
};




module.exports = obj;