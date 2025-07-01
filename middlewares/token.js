const jwt=require('jsonwebtoken');
function accessByToken(req,res,next){
    const accessToken=req.cookies.accessToken;
    const secret=process.env.ACCESS_TOKEN_SECRET;
    if(!accessToken) return res.status(401).json({error:'unauthorized'})
    try{
        const decoded=jwt.verify(accessToken,secret);
       // console.log(decoded);
        req.user=decoded;
        next();
    }
    catch(err){return res.status(401).json({error:'token invalid or expired'})}
}
module.exports=accessByToken