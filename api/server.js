const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const db = require("./module/db")
const token = require("./module/token")
const {upPic} = require("./module/upPic")
app.use(bodyParser.json())
app.post("/login",function(req,res){
    db.findOne("adminList",{
        adminName : req.body.adminName,
        passWord : req.body.passWord
    },function(err,adminInfo){
        //登录成功
        if(adminInfo){
            db.insertOne("adminLog",{
                adminId:adminInfo._id,
                adminName:adminInfo.adminName,
                loginTime:Date.now()
            },function(err,results){
                res.json({
                    ok : 1,
                    token : token.encode(req.body.adminName)
                })
            })
        }else{
            res.json({
                ok : -1,
                msg : "您的账号密码错误，请重新输入"
            })
        }
    })
})
app.get("/adminLog",function(req,res){
    var status = token.decode(req.headers.authorization);
    //token 成功
    if(status.ok === 1){
        var whereObj = {
            adminName : status.info.userName
        }
        var pageIndex = req.query.pageIndex/1;
        var limitNum = 5;
        db.count("adminLog",whereObj,function(count){
            db.find("adminLog",{
                whereObj,
                limitNum,
                skipNum : (pageIndex - 1) * limitNum,
                sortObj : {loginTime : -1}
            },function(err,adminLogList){
                var pageSum = Math.ceil(count / limitNum);
                if(pageSum < 1){
                    pageSum = 1;
                }
                if(pageIndex > pageSum){
                    pageIndex = pageSum;
                }
                if(pageIndex < 1){
                    pageIndex = 1;
                }
                res.json({
                    ok : 1,
                    adminLogList,
                    pageIndex,
                    pageSum
                })
            })
        })

    }else{
        res.json({
            ok : -1,
            msg: status.msg
        })
    }
})
//添加店铺类别
app.post("/addShopType",function(req,res){
    upPic(req,"shopTypePic",function(obj){
        if(obj.ok === 2){
            db.insertOne("shopTypeList",{
                shopTypeName: obj.params.shopTypeName,
                shopTypePic : obj.params.newPicName,
                addTime : Date.now()
            },function(err,results){
                res.json({
                    ok : 1,
                    msg : obj.msg
                })
            })
        }else{
            res.json({
                ok:-1,
                msg:obj.msg
            })
        }

    })
})
app.listen(80,function(){
    console.log("login...")
})