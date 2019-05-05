const jwt = require("jwt-simple");
const KEY = "r%^&^*%$&^*%(&*^(*";
module.exports.encode=function (userName) {
    const token = jwt.encode({
        userName,
        exp:Date.now()
    },KEY);
    return token;
}
module.exports.decode = function (token) {
    try{
        var info = jwt.decode(token,KEY)
        // 判断token是否过期
        if((Date.now()-info.exp)/1000 > 2*60*60){
            // 过期
            return {
                ok:-1,
                msg:"token已过期"
            }
        }else{
            // 未过期
            return {
                ok:1,
                info,
                msg:"token正常"
            }
        }
    }
    catch (err){
        // token 错误
        return {
            ok:-2,
            msg:"token异常"
        }
    }

}