var express = require('express');
var router = express.Router();
var BMP24 = require('../BMP24');
var makeCapcha = require('../makeCode');
var mysqlData = require("../mysqlData");

/* GET home page. */
router.use(function(req,res,next){
    res.locals.message = '';
    var info = req.session.info;
    delete req.session.info;
    if(info){
        res.locals.message = "<div class='message'>"+info+"</div>";
    }
    next();
});
router.route('/')
    .get( function(req, res) {
      res.render('login');
    })
    .post(function(req,res){
        mysqlData.queryData(req.body,req,res);
    });
router.route('/user')
    .get( function(req, res) {
        console.log(req.session.user);
        if(req.session.user){
            res.render("manage");
        }
        else{
            res.redirect("/");
        }
    })
    .post(function(req,res){

    });
router.get("/codeImg",function(req,res){
    if(req.url == '/favicon.ico'){
        return res.end();
    }
    var Img = makeCapcha();
    req.session.code = Img.str;
    res.end(Img.getFileData());

});
router.get("/logout",function(req,res){
    delete req.session.user;
    res.redirect("/");
});

module.exports = router;
