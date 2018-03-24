module.exports = function (app){
	app.get('/auth',(req,res)=>{

	})
	
	app.get('/users',(req,res)=>{
		const user = new usersData(db);
		user.addNewUser({
			name:'long',
			password:'password',
			admin:true
		})
		res.send('added new users')
	})
}