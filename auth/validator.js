const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
    const authHeader = req.headers["authorization"];
    let token;
    if(authHeader){
        token = authHeader.split(" ")[1];
    }
    else{
        token = null;
    }
    if(token == null){
        return res.status(401).json({message: "Unauthorized"});
    }
    console.log("Token found!");
    jwt.verify(token, process.env.SECRET, (err, user) => {
        if(err){
            return res.status(401).json({message: "Token expired"});
        }
        req.user = user;
        next();
    });
}