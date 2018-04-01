const jwt= require('jsonwebtoken');
const auth=require('./auth.js')

module.exports = (req,res,next)=>{
	try{
		const decoded = jwt.verify(req.body.token,auth.secret);
		req.userData=decoded
		next();		
	}catch(err){
		return res.status(401).json({
			message: 'You need to log in first'
		})
	}

}