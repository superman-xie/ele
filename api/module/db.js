const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const CONNECT_STR = "mongodb://127.0.0.1:27017";
// 连接数据库
function _connect(cb) {
    mongoClient.connect(CONNECT_STR,{
        useNewUrlParser:true
    },function (err,client) {
        if(err)
            console.log("连接失败")
        else{
            var db = client.db("ele");
            cb(db);
        }
    })
}
/*
* 插入一条记录
* coll:插入的集合
* insertObj:插入扔内容
* cb:回调函数*/
module.exports.insertOne=function(coll,insertObj,cb) {
    _connect(function (db) {
        db.collection(coll).insertOne(insertObj,cb)
    })
}
/*
* 根据条件搜索相应文档的记录条数*/
module.exports.count = function (coll,whereObj,cb) {
    _connect(function (db) {
        db.collection(coll).countDocuments(whereObj).then(cb)
    })
}
// 查找
module.exports.find = function (coll,obj,cb) {
    obj.whereObj = obj.whereObj || {};
    obj.skipNum = obj.skipNum || 0;
    obj.limitNum = obj.limitNum || 0;
    obj.sortObj = obj.sortObj || {}
    _connect(function (db) {
        db.collection(coll).find(obj.whereObj).skip(obj.skipNum).limit(obj.limitNum).sort(obj.sortObj).toArray(cb)
    })
}
module.exports.findOne = function (coll,whereObj,cb) {
    _connect(db=>{
        db.collection(coll).findOne(whereObj,cb)
    })
}
// 根据ID进行删除
module.exports.deleteOneById = function (coll,id,cb) {
    _connect(db=>{
        db.collection(coll).deleteOne({_id:mongodb.ObjectId(id)},cb);
    //  deleteMany
})
}
module.exports.deleteOne = function (coll,whereObj,cb) {
    _connect(db=>{
        db.collection(coll).deleteOne(whereObj,cb);
    //  deleteMany
})
}
module.exports.findOneById = function (coll,id,cb) {
    _connect(db=>{
        db.collection(coll).findOne({_id:mongodb.ObjectId(id)},cb);
    //  deleteMany
})
}
module.exports.updateOneById = function (coll,id,upObj,cb) {
    _connect(db=>{
        db.collection(coll).updateOne({_id:mongodb.ObjectId(id)},upObj,cb)
})
}

module.exports.updateOne = function (coll,whereObj,upObj,cb) {
    _connect(db=>{
        db.collection(coll).updateOne(whereObj,upObj,cb)
})
}
// module.exports.updateOneById("contextList","5caab347106d3a236c6a8bc9",{$inc:{topNum:2}},function (err,results) {
//     console.log(err);
// })
// module.exports.find("contextList",{
//     sortObj:{addTime:-1}
// },function (err,results) {
//     console.log(results);
// })
// module.exports.count("contextList",{"context":"68"},function (count) {
//     console.log(count);
// })