const fs = require("fs")

function logReqRes(filename){
    return(req,res,next)=>{
        const now = new Date();
        fs.appendFile(filename,`\n ${now.getHours()}Hr:${now.getMinutes()}MIN:${now.getSeconds()}SEC - ${req.method}: ${req.path}`, (
            err,data)=>{
            next();
        })
    }
}

module.exports = {
    logReqRes
}
