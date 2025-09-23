const jwt=require("jsonwebtoken");
const env=require("dotenv").config();
const JWT_SECERT_KEY=process.env.JWT_SECERT_KEY;

const generateToken=(user)=>{

        console.log(user);
        if(!user){
            return Error("user not found not able to generate a token");        
        }
        const payload = {
            id: user._id,
            email: user.email,
            username: user.username,
            role: user.role,
        };
        return jwt.sign(payload,JWT_SECERT_KEY,{expiresIn:'10d'})
}
const verifyToken=(req,res,next)=>{
    const authHeader=req.headers['authorization'];
    const token=authHeader && authHeader.split(" ")[1];
    if(!token){
        return res.status(403).json({ message: "Token is required" });
    }
    jwt.verify(token, JWT_SECERT_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = decoded;
    next();
  });
}


const checkRole = (requiredRole) => {
    return (req, res, next) => {
        if (req.user && req.user.role === requiredRole) {
            next();
        } else {
            res.status(403).json({ message: "Access Denied. Insufficient role." });
        }
    };
};


module.exports={generateToken,verifyToken,checkRole};