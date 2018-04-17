const jwt= require('jsonwebtoken');
const auth=require('./auth.js')

module.exports = (req,res,next)=>{
	try{
		const decoded = jwt.verify(req.body.token,auth.secret);
		console.log(decoded)
		req.userData=decoded;
			
	}catch(err){
		req.userData=null;
		res.status(401).json({
			message: "You're not logging in, please log in to continue"
		})
	}
	next();	
}