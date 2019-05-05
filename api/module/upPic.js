const tool = require("./tool");
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
module.exports.upPic = function(req,picName,cb){
    var form = new formidable.IncomingForm();//转换成一个实例
    form.encoding = "utf-8";//设置字符集格式
    form.uploadDir = path.resolve(__dirname,"../upload");//上传文件的目录
    form.keepExtensions = true; //是否保留拓展名
    form.parse(req,function(err,params,file){
        var picInfo = file[picName];
        //判断是否传入了图片   
        if(picInfo.size > 0){
            var extName = path.extname(picInfo.name);
            var extArr = [".jpg",".png",".gif"];
            if(extArr.includes(extName)){                
                var newPicName = Date.now() + "" + tool.getRandom(100000,999999) + extName;
                fs.rename(picInfo.path,form.uploadDir + "/" + newPicName,function(err){
                    params.newPicName = newPicName;
                    cb({
                        ok : 2,
                        msg : "上传图片成功",
                        params
                    })
                })
            }else{
                fs.unlink(form.uploadDir + "/",function(err){
                    cb({
                        ok : 1,
                        msg : "请选择正确的图片格式，例如：.jpg, .png, .gif"
                    }) 
                })
            }
            
        }else{
            fs.unlink(picInfo.path,function(err){
                cb({
                    ok : -1,
                    msg : "请选择你要上传的图",
                    params
                }) 
            })
        }
    })
}